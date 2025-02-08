import * as ma from 'azure-pipelines-task-lib/mock-answer';
import * as tmrm from 'azure-pipelines-task-lib/mock-run';
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

process.env["BUILD_REASON"] = "BatchedCI"
process.env["BUILD_SOURCEBRANCH"] = "refs/heads/releases/0.1.0"
process.env["BUILD_SOURCEBRANCHNAME"] = "0.1.0"

tmr.setInput('configurationLocation', 'configurationPath');
tmr.setInput('configurationPath', 'src/CalculateNextVersionV1/tests/config.yaml');

tmr.run();