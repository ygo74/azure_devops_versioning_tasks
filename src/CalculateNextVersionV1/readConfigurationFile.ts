import * as fs from 'fs';
import * as yaml from 'js-yaml';
import tl = require('azure-pipelines-task-lib/task');


export interface BranchPatternMap {
  [pattern: string]: string;
}

export interface BranchConfiguration {
  sourceVersion: string;
  sourceVersionMode: string;
  sourceVersionBranchPattern: string;
  patternMap: string[];
  versionIncrement: string;
  versionLabel: string;
}

export interface Configuration {
  [branchType: string]: BranchConfiguration;
}

export interface BranchesConfig {
  configuration: Configuration;
}

export function findMatchingKey(branch: string, yamlPath: string): BranchConfiguration | undefined {
  try {
    // Lire le contenu du fichier YAML
    const fileContents = fs.readFileSync(yamlPath, 'utf8');

    // Parser le contenu YAML en un objet JavaScript
    const config = yaml.load(fileContents) as BranchesConfig;
    tl.debug('Config found');
    tl.debug(`${JSON.stringify(config)}`);
    console.log(config);

    // Vérifier si la clé de configuration et la sous-clé patternMap existent dans la structure YAML
    if (config.configuration) {
      const branchTypes = Object.keys(config.configuration);
      tl.debug(`branchTypes: ${branchTypes}`);

      for (const branchType of branchTypes) {
        tl.debug(`branchType ${branchType}`);
        const branchConfig = config.configuration[branchType];
        const { sourceVersionBranchPattern, patternMap } = branchConfig;

        tl.debug(`branchConfig: ${JSON.stringify(branchConfig)}`);
        tl.debug(`sourceVersionBranchPattern: ${sourceVersionBranchPattern}`);
        tl.debug(`patternMap: ${patternMap}`);

        for (const pattern of patternMap) {
            if (branch.match(pattern)) {
                tl.debug(`config with pattern ${pattern} match branch ${branch}`);
                return branchConfig;
            }
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la lecture du fichier YAML :', error);
  }

  return undefined;
}
