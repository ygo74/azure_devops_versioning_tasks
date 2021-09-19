import tl = require('azure-pipelines-task-lib/task');
const semver = require('semver');

async function run() {
    try {
        const inputString: string | undefined = tl.getInput('samplestring', true);
        if (inputString == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        console.log('Hello', inputString);


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