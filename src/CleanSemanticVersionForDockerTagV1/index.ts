import path = require('path');
import tl = require('azure-pipelines-task-lib/task');

async function run(): Promise<void> {
  try {
    tl.debug('Start Task Run' );
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    // Read Mandatory inputs
    const currentVersion: string = tl.getInput('semanticVersioning', true) || '';

    // Nettoyer la version (remplacer '+' par '-')
    const cleanedVersion: string = currentVersion.replace(/\+/g, '-');

    // Afficher la version nettoyée
    console.log(`Cleaned version: ${cleanedVersion}`);

    // End of task set ouput variables
    tl.setVariable("CleanedVersion", cleanedVersion, false, true);
    tl.setResult(tl.TaskResult.Succeeded, "");

  }
//   catch (error) {
//     console.error('Une erreur s\'est produite:', error);
//     // En cas d'erreur, marquer la tâche comme échouée
//     process.exitCode = TaskResult.Failed;
//   }
  catch (err: unknown) {
    if (err instanceof Error) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
  }

}

run();
