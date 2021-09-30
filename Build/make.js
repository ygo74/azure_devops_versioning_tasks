// parse command line options
var minimist = require('minimist');
var mopts = {
    string: [
        'node',
        'runner',
        'server',
        'suite',
        'task',
        'version'
    ]
};
var options = minimist(process.argv, mopts);

// remove well-known parameters from argv before loading make,
// otherwise each arg will be interpreted as a make target
process.argv = options._;

// modules
var make = require('shelljs/make');
var fs = require('fs');
var os = require('os');
var path = require('path');
var semver = require('semver');
var util = require('./make-util');
var admzip = require('adm-zip');

// global paths
var buildPath = path.join(__dirname, '../_build', 'Tasks');
var testResultPath = path.join(__dirname, '../_testResults');
var commonPath = path.join(__dirname, '_build', 'Tasks', 'Common');
var packagePath = path.join(__dirname, '_package');
var legacyTestPath = path.join(__dirname, '_test', 'Tests-Legacy');
var legacyTestTasksPath = path.join(__dirname, '_test', 'Tasks');

// util functions
var cd = util.cd;
var cp = util.cp;
var mkdir = util.mkdir;
var rm = util.rm;
var test = util.test;
var run = util.run;
var banner = util.banner;
var rp = util.rp;
var fail = util.fail;
var ensureExists = util.ensureExists;
var pathExists = util.pathExists;
var addPath = util.addPath;
var matchFind = util.matchFind;

var buildNodeTask = util.buildNodeTask;
var copyTaskResources = util.copyTaskResources;

// node min version
var minNodeVer = '6.10.3';
if (semver.lt(process.versions.node, minNodeVer)) {
    fail('requires node >= ' + minNodeVer + '.  installed: ' + process.versions.node);
}

// Node 14 is supported by the build system, but not currently by the agent. Block it for now
var supportedNodeTargets = ["Node", "Node10"/*, "Node14"*/];

// add node modules .bin to the path so we can dictate version of tsc etc...
var binPath = path.join(__dirname, '../node_modules', '.bin');
if (!test('-d', binPath)) {
    fail('node modules bin not found.  ensure npm install has been run.');
}

addPath(binPath);

// resolve list of tasks
var taskList;
if (options.task) {
    // find using --task parameter
    taskList = matchFind(options.task, path.join(__dirname, '../src'), { noRecurse: false, matchBase: true })
        .map(function (item) {
            return path.basename(item);
        });
    if (!taskList.length) {
        fail('Unable to find any tasks matching pattern ' + options.task);
    }
}
else {
    fail('task argument is mandatory.');
}

target.clean = function () {
    var taskName = options.task;
    banner('Cleaning: ' + taskName);
    var taskBuildPath = path.join(buildPath,taskName);
    rm('-Rf', taskBuildPath);
    // mkdir('-p', buildPath);
    // rm('-Rf', path.join(__dirname, '_test'));
};


target.build = function() {
    var taskName = options.task;
    banner('Building: ' + taskName);
    var taskPath = path.join(__dirname, "../src/",taskName);
    var taskBuildPath = path.join(buildPath,taskName);
    buildNodeTask(taskPath, taskBuildPath);

    // copy default resources and any additional resources defined in the module's make.json
    console.log();
    console.log('> copying module resources');
    var modMakePath = path.join(taskPath, 'make.json');
    var modMake = test('-f', modMakePath) ? fileToJson(modMakePath) : {};
    copyTaskResources(modMake, taskPath, taskBuildPath);
}

target.test = function() {

    var taskName = options.task;
    var taskPath = path.join(__dirname, "../src/",taskName, "tests");
    if (!test('-d', taskPath)) {
        banner('No tests for : ' + taskName);
        return;
    }

    banner('Building tests for : ' + taskName);
    var taskBuildPath = path.join(buildPath,taskName, "tests");
    buildNodeTask(taskPath, taskBuildPath);

    // copy default resources and any additional resources defined in the module's make.json
    console.log();
    console.log('> copying module resources');
    var modMakePath = path.join(taskPath, 'make.json');
    var modMake = test('-f', modMakePath) ? fileToJson(modMakePath) : {};
    copyTaskResources(modMake, taskPath, taskBuildPath);

    var suiteType = options.suite || '_suite';
    var pattern1 = path.join(taskBuildPath, suiteType + '.js');

    if (!fs.existsSync(pattern1)) {
        console.warn(`Unable to find tests using the following patterns: ${pattern1}`);
        return;
    }

    var testResultTaskPath = path.join(testResultPath, taskName + '-results.xml');
    run('mocha ' + pattern1 + ' --reporter mocha-junit-reporter --reporter-options output=' + testResultTaskPath, /*inheritStreams:*/true);
}

target.bump = function() {

    // load files
    var taskName = options.task;
    var taskPath = path.join(__dirname, "../src/",taskName);

    var taskJsonPath = path.join(taskPath, 'task.json');
    var taskJson = JSON.parse(fs.readFileSync(taskJsonPath));

    // var taskLocJsonPath = path.join(taskPath, 'task.loc.json');
    // var taskLocJson = JSON.parse(fs.readFileSync(taskLocJsonPath));

    if (typeof taskJson.version.Patch != 'number') {
        fail(`Error processing '${taskName}'. version.Patch should be a number.`);
    }

    taskJson.version.Patch = taskJson.version.Patch + 1;
    // taskLocJson.version.Patch = taskLocJson.version.Patch + 1;

    fs.writeFileSync(taskJsonPath, JSON.stringify(taskJson, null, 4));
    // fs.writeFileSync(taskLocJsonPath, JSON.stringify(taskLocJson, null, 2));

    // Check that task.loc and task.loc.json versions match
//     if ((taskJson.version.Major !== taskLocJson.version.Major) ||
//         (taskJson.version.Minor !== taskLocJson.version.Minor) ||
//         (taskJson.version.Patch !== taskLocJson.version.Patch)) {
//         console.log(`versions dont match for task '${taskName}', task json: ${JSON.stringify(taskJson.version)} task loc json: ${JSON.stringify(taskLocJson.version)}`);
//     }
}