# azure_devops_versioning_tasks

Provides some tasks to calculate and update version for main technologies.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/ygo74/azure_devops_versioning_tasks/blob/master/LICENSE)



## tasks dependencies

### CalculateNextVersion
https://www.npmjs.com/package/semver

``` powershell
$env:AGENT_VERSION='2.115.0'
$env:AGENT_JOBNAME='jobName'
$env:AGENT_TEMPDIRECTORY=$(Get-Location | Select-Object -ExpandProperty Path)
$env:SYSTEM_DEFAULTWORKINGDIRECTORY=$(Get-Location | Select-Object -ExpandProperty Path)
$env:SYSTEM_DEFINITIONID='123'
$env:SYSTEM_COLLECTIONID='collection1'
$env:SYSTEM_HOSTTYPE='build'
$env:SYSTEM_SERVERTYPE="hosted"
$env:SYSTEM_TEAMFOUNDATIONCOLLECTIONURI="https://abc.visualstudio.com/"
$env:SYSTEM_TEAMPROJECT='project1'
$env:BUILD_BUILDID='1'
$env:BUILD_BUILDNUMBER='1'
$env:BUILD_DEFINITIONNAME='test'
$env:BUILD_SOURCEVERSION="123abc"
$env:BUILD_SOURCEBRANCHNAME="master"

$env:INPUT_STRATEGY="File"
$env:INPUT_VERSIONSCHEME="Semver"
$env:INPUT_
$env:INPUT_
$env:INPUT_
$env:INPUT_

```