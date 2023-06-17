## prerequisites

 npm i -g tfx-cli
 npm WARN deprecated core-js@2.3.0: core-js@<3.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Please, upgrade your dependencies to the actual version of core-js.

 npm install -g typescript
 + typescript@4.4.3
added 1 package from 1 contributor in 18.02s

## develop tasks

1. create folder

    ```powershell
    npm init --yes
    npm install azure-pipelines-task-lib --save
    npm install azure-pipelines-tool-lib --save
    npm install @types/node --save-dev
    npm install @types/q --save-dev
    ```

    npm install typescript@^4.4.3 -g --save-dev

2. Create tsconfig.json compiler options

    ```powershell
    tsc --init --target es6
    ```

3. Install test tools

    ```powershell
    npm install mocha --save-dev
    npm install sync-request --save-dev
    npm install @types/mocha --save-dev
    ```

## Run tests

tsc
mocha tests/_suite.js

$env:TASK_TEST_TRACE=1

remarks :

+ Catch Error : <https://stackoverflow.com/questions/68240884/error-object-inside-catch-is-of-type-unkown>

## Build extension

tfx extension create --manifest-globs .\azure-devops-extension.json --output-path ./_releases --rev-version

## Debug

<https://github.com/microsoft/azure-pipelines-tasks/blob/master/docs/debugging.md>
