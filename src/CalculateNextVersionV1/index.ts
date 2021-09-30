import tl = require('azure-pipelines-task-lib/task');
const semver = require('semver');

async function run() {
    try {

        // Read environments variables
        const sourceBranch: string | undefined = tl.getVariable('Build.SourceBranch');
        console.log('SourceBranch', sourceBranch);

        // Read Mandatory inputs
        const strategy: string | undefined = tl.getInput('Strategy', true);
        const filePath: string | undefined = tl.getInput('FilePath', false);
        const language: string | undefined = tl.getInput('Language', false);
        const assemblyAttribute: string | undefined = tl.getInput('AssemblyAttribute', false);
        const versionVariablePath: string | undefined = tl.getInput('VersionVariablePath', false);
        const versionScheme: string | undefined = tl.getInput('VersionScheme', true);

        // Display Variables
        console.log('Strategy : ', strategy);
        console.log('FilePath : ', filePath);
        console.log('Language : ', language);
        console.log('AssemblyAttribute : ', assemblyAttribute);
        console.log('VersionVariablePath : ', versionVariablePath);
        console.log('VersionScheme : ', versionScheme);

        // Test semver increment
        let version = '1.0.0';
        let versionNext =semver.inc(version);
        console.log('Next Version calculated', versionNext);


    }
    catch (err: unknown) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();