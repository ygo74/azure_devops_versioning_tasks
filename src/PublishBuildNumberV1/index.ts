import path = require('path');
import tl = require('azure-pipelines-task-lib/task');

async function run(): Promise<void> {
  try {
    tl.debug('Start Task Run' );
    tl.setResourcePath(path.join(__dirname, 'task.json'));

    // Read Mandatory inputs
    let currentVersion: string = tl.getInput('semanticVersioning', true) || '';
    const uniqueCounter: string = tl.getInput('uniqueCounter', false) || '';

    if (uniqueCounter != '' && uniqueCounter != "0")
    {
        // Apply unique counter to semantic Versioning
        currentVersion = `${currentVersion}+${uniqueCounter}`
    }

    // Nettoyer la version (remplacer '+' par '-')
    const cleanedVersion: string = currentVersion.replace(/\+/g, '_');

    // Afficher les versions à publier
    console.log(`Full semantic versioning: ${currentVersion}`);
    console.log(`Cleaned version for OCI: ${cleanedVersion}`);

    // End of task set ouput variables
    tl.setVariable("SemanticVersion", currentVersion, false, true);
    tl.setVariable("CleanedVersion", cleanedVersion, false, true);

    // Update Build number with the Semantic version
    tl.updateBuildNumber(currentVersion);

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
