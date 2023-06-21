import { TaskResult, getInput, setOutput } from 'azure-pipelines-task-lib/task';

async function run(): Promise<void> {
  try {
    // Récupérer la version actuelle
    const currentVersion: string = process.env.BUILD_BUILDNUMBER || '';

    // Nettoyer la version (remplacer '+' par '-')
    const cleanedVersion: string = currentVersion.replace(/\+/g, '-');

    // Afficher la version nettoyée
    console.log(`Cleaned version: ${cleanedVersion}`);

    // Définir la variable d'environnement pour une utilisation ultérieure
    setOutput('CleanedVersion', cleanedVersion);
  } catch (error) {
    console.error('Une erreur s\'est produite:', error);
    // En cas d'erreur, marquer la tâche comme échouée
    process.exitCode = TaskResult.Failed;
  }
}

run();
