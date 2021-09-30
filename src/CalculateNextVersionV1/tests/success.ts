import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('samplestring', 'human');
process.env["BUILD_SOURCEBRANCH"] = "refs/heads/main2"

tmr.setInput('Strategy', 'File');
tmr.setInput('FilePath', 'src/Assembly.cs');
tmr.setInput('Language', 'CSharp');
tmr.setInput('AssemblyAttribute', 'AssemblyInformationalVersion');
tmr.setInput('VersionVariablePath', 'N/A');
tmr.setInput('VersionScheme', 'SemVer');


tmr.run();