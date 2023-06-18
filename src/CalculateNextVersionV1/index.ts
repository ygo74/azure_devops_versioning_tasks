import path = require('path');
import tl = require('azure-pipelines-task-lib/task');

import * as parser from './parsefile';
import { getHighestVersionFromBranches } from './branchVersionUtils';
import { getCommitCount } from './branchVersionUtils';
import { BranchConfiguration, findMatchingKey } from './readConfigurationFile';

import * as toolLib from 'azure-pipelines-tool-lib/tool';

const semver = require('semver');

async function run() {
    try {

        tl.debug('Start Task Run' );
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        // Read environments variables
        const sourceBranch: string | undefined = tl.getVariable('Build.SourceBranch');
        const sourceBranchName: string | undefined = tl.getVariable('Build.SourceBranchName');
        if (sourceBranch === undefined) throw new Error(`Unable to Get environment variable with Branch, lookup of Build.SourceBranch not found`);
        if (sourceBranchName === undefined) throw new Error(`Unable to Get environment variable with Branch Name, lookup of Build.SourceBranchName not found`);
        console.log('sourceBranch : ', sourceBranch);
        console.log('sourceBranchName : ', sourceBranchName);

        // Read Mandatory inputs
        const configurationLocation: string | undefined = tl.getInput('configurationLocation', true);
        if (configurationLocation === undefined) throw new Error(`configurationLocation is not defined`);
        const configurationPath: string | undefined = tl.getInput('configurationPath', true);
        if (configurationPath === undefined) throw new Error(`ConfigurationPath is mandatory when configurationLocation is a file`);

        // Display Variables
        console.log('Configuration Location : ', configurationLocation);
        console.log('Configuration file path : ', configurationPath);

        // Utiliser l'interface BranchConfiguration
        const config: BranchConfiguration | undefined = findMatchingKey(sourceBranch, configurationPath);
        if (config === undefined)
        {
            throw new Error(`Unable to find a configuration for branch ${sourceBranch}`);
        }
        console.log('Configuration found : ', config);

        // Retrieve the current version number
        let highestVersion: string;
        switch(config.sourceVersion) {

            case "git":
                tl.debug('Search Highest version from existing branches' );
                highestVersion = getHighestVersionFromBranches(config.sourceVersionBranchPattern);
                break;

            default:
                throw new Error(`source version ${config.sourceVersion} is unknown`);
                break;
        }
        console.log(`Found Current version equals to ${highestVersion}`);

        // Test semver increment
        let versionNext =semver.inc(highestVersion, config.versionIncrement);
        console.log('Next Version calculated', versionNext);

        if (config.hasOwnProperty('versionLabel'))
        {
            console.log('Add label to next version', config.versionLabel);
            versionNext = `${versionNext}-${config.versionLabel}`
            console.log('Next Version calculated with label', versionNext);

            // Add number of commit from branch
            const commitCount = getCommitCount(sourceBranch)
            versionNext = `${versionNext}.${commitCount}`
            console.log('Next Version calculated with commit count', versionNext);
        }

        // End of task set ouput variables
        tl.setVariable("version", versionNext, false, true);
        tl.setResult(tl.TaskResult.Succeeded, "");


    }
    catch (err: unknown) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();