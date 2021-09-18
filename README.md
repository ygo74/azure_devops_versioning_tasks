# azure_devops_versioning_tasks

## sources

https://docs.microsoft.com/en-us/azure/devops/extend/develop/add-build-task?view=azure-devops


https://github.com/microsoft/azure-pipelines-tasks/blob/master/Tasks/ArchiveFilesV2/task.json

https://docs.microsoft.com/en-us/azure/devops/extend/develop/integrate-build-task?view=azure-devops


builtin tasks : https://github.com/microsoft/azure-pipelines-tasks/

samples : https://github.com/Microsoft/azure-devops-extension-sample

azure-devops-extension-tasks : https://github.com/microsoft/azure-devops-extension-tasks/tree/main/BuildTasks

## prerequisites

 npm i -g tfx-cli
 npm WARN deprecated core-js@2.3.0: core-js@<3.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Please, upgrade your dependencies to the actual version of core-js.

 npm install -g typescript
 + typescript@4.4.3
added 1 package from 1 contributor in 18.02s

## develop tasks

create folder

```powershell
npm init --yes
npm install azure-pipelines-task-lib --save
npm install @types/node --save-dev
npm install @types/q --save-dev
```

Create tsconfig.json compiler options
```powershell
tsc --init --target es6
```


Install test tools

```powershell
npm install mocha --save-dev
npm install sync-request --save-dev
npm install @types/mocha --save-dev
```

RUN tests

tsc
mocha tests/_suite.js

$env:TASK_TEST_TRACE=1


remarks :
=> Catch Error : https://stackoverflow.com/questions/68240884/error-object-inside-catch-is-of-type-unkown

## Build extension
tfx extension create --manifest-globs .\azure-devops-extension.json --output-path ./Releases --rev-version