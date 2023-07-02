import path = require('path');
import tl = require('azure-pipelines-task-lib/task');

import * as parser from './parsefile';
import { getHighestVersionFromBranches, getCurrentVersionFromBranch, findBranchWithMaxVersion } from './branchVersionUtils';
import { getCommitCount, incrementPatchVersion } from './branchVersionUtils';
import { BranchConfiguration, findMatchingKey } from './readConfigurationFile';

import * as toolLib from 'azure-pipelines-tool-lib/tool';

const semver = require('semver');

async function run() {
    try {

        tl.debug('Start Task Run' );
        tl.setResourcePath(path.join(__dirname, 'task.json'));

        // Read Mandatory inputs
        const configurationLocation: string | undefined = tl.getInput('configurationLocation', true);
        if (configurationLocation === undefined) throw new Error(`configurationLocation is not defined`);
        const configurationPath: string | undefined = tl.getInput('configurationPath', true);
        if (configurationPath === undefined) throw new Error(`ConfigurationPath is mandatory when configurationLocation is a file`);

        console.log('Configuration Location : ', configurationLocation);
        console.log('Configuration file path : ', configurationPath);

        // Detect if we are on a Pull request or an other reason
        const buildReason: string = tl.getVariable('Build.Reason') || '';
        const isPullRequest: boolean = buildReason === 'PullRequest';

        // Init branch variables
        let sourceBranch: string | undefined = undefined;
        let sourceBranchName: string | undefined = undefined;
        let targetBranch: string | undefined = undefined;
        let targetBranchName: string | undefined = undefined;

        // Read environments variables
        if (isPullRequest) {
            console.log('Build from Pull request');

            // Read source branch Name and branch target from
            // Branch origin : SYSTEM_PULLREQUEST_SOURCEBRANCH
            sourceBranch = tl.getVariable('System.PullRequest.SourceBranch');
            sourceBranchName = 'PullRequest'; // TODO see how have only the name as for normal build
        } else {
            console.log('Build from branch');

            // Read source branch name from BUILD_SOURCEBRANCH or BUILD_SOURCEBRANCHNAME
            sourceBranch = tl.getVariable('Build.SourceBranch');
            sourceBranchName = tl.getVariable('Build.SourceBranchName');
        }

        if (sourceBranch === undefined) throw new Error(`Unable to Get environment variable with Branch, lookup of Build.SourceBranch not found`);
        if (sourceBranchName === undefined) throw new Error(`Unable to Get environment variable with Branch Name, lookup of Build.SourceBranchName not found`);
        console.log('source Branch : ', sourceBranch);
        console.log('source BranchName : ', sourceBranchName);

        // Read target branch from pull request information
        if (isPullRequest) {
            // Branch target : SYSTEM_PULLREQUEST_TARGETBRANCH or SYSTEM_PULLREQUEST_TARGETBRANCHNAME
            // Pull request number : SYSTEM_PULLREQUEST_PULLREQUESTNUMBER
            targetBranch = tl.getVariable('System.PullRequest.TargetBranch');
            targetBranchName = tl.getVariable('System.PullRequest.TargetBranchName');
            if (targetBranch === undefined) throw new Error(`Unable to Get environment variable with target Branch, lookup of System.PullRequest.TargetBranch not found`);
            if (targetBranchName === undefined) throw new Error(`Unable to Get environment variable with traget Branch Name, lookup of System.PullRequest.TargetBranchName not found`);
            console.log('Target Branch : ', targetBranch);
            console.log('Target Branch Name : ', targetBranchName);
        }

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
                if (config.sourceVersionMode == "branch") {
                    tl.debug('Search Highest version from existing branches' );
                    highestVersion = findBranchWithMaxVersion(config.sourceVersionBranchPattern);
                }
                else {
                    tl.debug('Search version from the current branch' );
                    highestVersion = getCurrentVersionFromBranch(sourceBranch);
                    // Add number of commit from branch
                    const commitCount = getCommitCount(sourceBranch)
                    highestVersion = incrementPatchVersion(highestVersion, commitCount);
                }
                break;

            default:
                throw new Error(`source version ${config.sourceVersion} is unknown`);
                break;
        }
        console.log(`Found Current version equals to ${highestVersion}`);

        // Test semver increment
        let versionNext: string = '';
        if (config.versionIncrement != null && config.versionIncrement != undefined) {
            versionNext = semver.inc(highestVersion, config.versionIncrement);
        }
        else {
            versionNext = highestVersion
        }
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

            // Add branch Name
            if (config.addBranchName)
            {
                versionNext = `${versionNext}-${sourceBranchName}`
            }
        }

        // End of task set ouput variables
        tl.setVariable("version", versionNext, false, true);

        // Update Build Number
        tl.updateBuildNumber(versionNext);

        // Finish the task with success status
        tl.setResult(tl.TaskResult.Succeeded, "");

    }
    catch (err: unknown) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();