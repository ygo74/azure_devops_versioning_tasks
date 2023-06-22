import { execSync } from 'child_process';

export function getHighestVersionFromBranches(branchPrefix: string): string {
  // Récupérer les noms de branches Git
  const gitBranchesOutput = execSync('git branch --format="%(refname:short)"').toString();
  const branchNames = gitBranchesOutput.split('\n');

  // Définir un regex pour extraire les numéros de version des noms de branches
  const versionRegex = /\d+\.\d+\.\d+/;

  let highestVersion = '0.0.0';

  // Parcourir les noms de branches pour trouver le numéro de version le plus élevé
  branchNames.forEach((branchName) => {
    if (branchName.startsWith(branchPrefix)) {
      const match = branchName.match(versionRegex);
      if (match && match[0] > highestVersion) {
        highestVersion = match[0];
      }
    }
  });

  return highestVersion;
}

export function getCurrentVersionFromBranch(branchName: string): string {

  // extract version from branch Name
  const versionRegex = /\d+\.\d+\.\d+/;
  const versionMatch  = branchName.match(versionRegex);
  if (versionMatch && versionMatch[0]) {
    return versionMatch[0];
  }
  // default version
  return "0.0.0"

}



export function getCommitCount(branch: string): number {
  const safeBranch = removeRefsHeads(branch);
  const command = `git rev-list --count origin/master..${safeBranch}`;
  const result = execSync(command).toString().trim();

  return parseInt(result, 10);
}

function removeRefsHeads(branch: string): string {
  const pattern = /^refs\/heads\//;
  if (pattern.test(branch)) {
    return branch.replace(pattern, 'origin/');
  }
  else {
    return `origin/${branch}`
  }

}

export function incrementPatchVersion(version: string, commitCount: number): string {
  const versionParts = version.split('.');
  if (versionParts.length !== 3) {
    throw new Error('Invalid semantic version format');
  }

  const patch = parseInt(versionParts[2]);
  const newPatch = patch + commitCount;

  if (isNaN(newPatch)) {
    throw new Error('Invalid commit count');
  }

  return `${versionParts[0]}.${versionParts[1]}.${newPatch}`;
}

