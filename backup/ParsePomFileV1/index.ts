import tl = require('azure-pipelines-task-lib/task');
import { sensitiveHeaders } from 'http2';

async function run() {
    try {
        const pomFile = tl.getPathInput("pomFilePath", true, true);

        // Display parameters
        console.info('PomFilePath', pomFile);

        // Read file
        var xml = require('fs').readFileSync(pomFile, 'utf8');
        var convert = require('xml-js');
        var options = {compact: true, ignoreComment: true, alwaysChildren: true};
        var result = convert.xml2js(xml, options);

        // Read version from result
        if (!result.project)
        {
            throw new Error("Missing project element in pom file " + pomFile);
        }

        if (!result.project.version)
        {
            throw new Error("Missing version element under project element in pom file " + pomFile);
        }

        var version: string | undefined = result.project.version._text

        if (!version)
        {
            throw new Error("Missing version element in pom file " + pomFile);
        }

        // Display task result
        console.log(version);

        // parse to semver
        var semver = require('semver')
        var semverVersion = semver.coerce(version);
        console.log(semverVersion);

        // Set task outputs
        tl.setVariable("version", version, false, true);
        tl.setResult(tl.TaskResult.Succeeded, "");

    }
    catch (err: unknown) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    }
}

run();