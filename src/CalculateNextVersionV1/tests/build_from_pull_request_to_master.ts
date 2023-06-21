import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env["BUILD_REASON"] = "PullRequest"
process.env["BUILD_SOURCEBRANCH"] = "refs/pull/17/merge"
process.env["BUILD_SOURCEBRANCHNAME"] = "merge"
process.env["SYSTEM_PULLREQUEST_SOURCEBRANCH"] = "feature/test-1"
process.env["SYSTEM_PULLREQUEST_TARGETBRANCH"] = "main"
process.env["SYSTEM_PULLREQUEST_TARGETBRANCHNAME"] = "main"

tmr.setInput('configurationLocation', 'configurationPath');
tmr.setInput('configurationPath', 'src/CalculateNextVersionV1/tests/config.yaml');

tmr.run();