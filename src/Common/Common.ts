import * as os from "os";
import * as path from "path";
import * as stream from "stream";
import * as fs from "fs";
import * as tl from "azure-pipelines-task-lib/task";
import * as trl from "azure-pipelines-task-lib/toolrunner";

import ToolRunner = trl.ToolRunner;

function writeBuildTempFile(taskName: string, data: any): string {
    let tempFile: string;
    do {
        // Let's add a random suffix
        const randomSuffix = Math.random().toFixed(6);
        tempFile = path.join(os.tmpdir(), `${taskName}-${randomSuffix}.tmp`);
    } while (tl.exist(tempFile));

    tl.debug(`Generating Build temp file: ${tempFile}`);
    tl.writeFile(tempFile, data);

    return tempFile;
}

function deleteBuildTempFile(tempFile: string) {
    if (tempFile && tl.exist(tempFile)) {
        tl.debug(`Deleting temp file: ${tempFile}`);
        fs.unlinkSync(tempFile);
    }
}