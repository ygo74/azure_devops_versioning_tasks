import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';

describe('Sample task tests', function () {

    before( function() {
        process.env['AGENT_VERSION'] = '2.115.0';
        process.env["AGENT_JOBNAME"] = 'jobName';
        process.env["AGENT_TEMPDIRECTORY"] = process.cwd();

        process.env["SYSTEM_DEFAULTWORKINGDIRECTORY"] =  process.cwd();
        process.env["SYSTEM_DEFINITIONID"] = '123';
        process.env["SYSTEM_COLLECTIONID"] = 'collection1';
        process.env["SYSTEM_HOSTTYPE"] = 'build';
        process.env["SYSTEM_SERVERTYPE"] = "hosted";
        process.env["SYSTEM_TEAMFOUNDATIONCOLLECTIONURI"] = "https://abc.visualstudio.com/";
        process.env["SYSTEM_TEAMPROJECT"] = 'project1';

        process.env["BUILD_BUILDID"] = '1';
        process.env["BUILD_BUILDNUMBER"] = '1';
        process.env["BUILD_DEFINITIONNAME"] = 'test';
        process.env["BUILD_SOURCEVERSION"] = "123abc"

    });

    after(() => {

    });

    it('should succeed with simple inputs', function(done: Mocha.Done) {
        // Add success test here
        this.timeout(1000);

        let tp = path.join(__dirname, 'success.js');
        let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

        tr.run();

        const stdout = tr.stdout;
        const stderr = tr.stderr;

        console.log('stdout:', stdout);
        console.log('stderr:', stderr);

        console.log(tr.succeeded);
        assert.equal(tr.succeeded, true, 'should have succeeded');
        assert.equal(tr.warningIssues.length, 0, "should have no warnings");
        assert.equal(tr.errorIssues.length, 0, "should have no errors");
        console.log(tr.stdout);
        assert.equal(tr.stdout.indexOf('Strategy :') >= 0, true, "should display Strategy");
        done();

    });

    // it('it should fail if tool returns 1', function(done: Mocha.Done) {
    //     // Add failure test here
    //     this.timeout(1000);

    //     let tp = path.join(__dirname, 'failure.js');
    //     let tr: ttm.MockTestRunner = new ttm.MockTestRunner(tp);

    //     tr.run();
    //     console.log(tr.succeeded);
    //     assert.equal(tr.succeeded, false, 'should have failed');
    //     assert.equal(tr.warningIssues.length, 0, "should have no warnings");
    //     assert.equal(tr.errorIssues.length, 1, "should have 1 error issue");
    //     assert.equal(tr.errorIssues[0], 'Bad input was given', 'error issue output');
    //     assert.equal(tr.stdout.indexOf('Hello bad'), -1, "Should not display Hello bad");

    //     done();
    // });
});