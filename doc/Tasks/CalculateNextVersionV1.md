# CalculateNextVersionV1

## Inputs

| Input     | Description | Dependency |
| --------- | ----------- | ---------- |
| Strategy  | (Optional) String. Define how retrieve the version to calculate the NextVersion<br />Default value is **File**<br />Choices :<br /> <ul><li>File : Retrieve version from a file</li><li>User : Version is given in parameters</li><li>Tag : Retrieve version from the tag name</li></ul> | N/A |
| FilePath  | (Required) String. Define the file which contains the version | Strategy==File |
| Language  | (Required) String. Define the file format which contains the version<br />Choices :<br /><ul><li>CSharp</li><li>VB</li><li>Maven</li><li>Nodejs</li><li>Yaml</li><li>Json</li><li>Xml</li></ul> | Strategy==File |
| AssemblyAttribute | (Optional) String. Define the attribute which contains the version<br/>Default value is **AssemblyInformationalVersion**<br />Choices :<br /><ul><li>AssemblyInformationalVersion</li><li>AssemblyVersion</li><li>AssemblyFileVersion</li></ul> | Language==CSharp | Language==VB |
| VersionVariablePath | (Required) String. Define the path to find the version variable in a Yaml, Json or XML file | Language in ('Yaml', 'Json', 'Xml') |
| VersionScheme | (Optional) String. Define the expected next version scheme<br />Default value is **SemVer**<br />Choices :<br /><ul><li>SemVer</li><li>Calendar</li></ul> | N/A |
| PatchAutoIncrement  | (Optional) Boolean. Define if the patch value is calculated from existing package found in an external repository<br />Default value is **true** | VersionScheme=='SemVer' |
| RepositoryKind      | (Required) String. Define the repository type which contains existing package<br />Choices :<br /><ul><li>Nuget</li><li>PowershellGet</li><li>Maven</li><li>Npm</li><li>Docker</li><li>Generic</li></ul> | PatchAutoIncrement==true |
| RepositoryUri       | (Optional when RepositoryKind has a well known Internet repository : Nuget, Maven, Npm, Docker, Python. Otherwise Mandatory) Url. Define the repository url to query for retrieving existing package. <br />Choices :<br /><ul><li>Nuget</li><li>Maven</li><li>Npm</li><li>Docker</li><li>Generic</li></ul> | PatchAutoIncrement==true |

## Strategy

Strategy will define how retrieve the version to calculate the NextVersion

### File

For **File** strategy, following inputs are mandatory :

* FilePath : File path which contains the version
* Language : File language association
  * CSharp : Expected AssembyInfo.cs format. Need also to have the Assembly attribute to be used for the version
  * VB     : Expected AssembyInfo.vb format. Need also to have the Assembly attribute to be used for the version
  * Maven  : Expected pom.xml format
  * Nodejs : Expected package.json format
  * Yaml   : Expected generic yaml format. Need also to have the Yaml path to get the version variable
  * Json   : Expected generic json format. Need also to have the json path to get the version variable
  * Xml    : Expected generic xml format. Need also to have the json path to get the version variable

Optional atributes depending values from mandatory variables :

* AssemblyAttribute
* VersionVariablePath

### User

For **User** strategy, following inputs are mandatory :

* Version : Expected version

### Tag

No Mandatory attributes.

## Process

### Version Check

We should support the following versioning scheme :

* SemVer : Version must be at least with Major.Minor or Version can be Full Major.Minor.Patch and can also contains the metadata
* Calendar versionning : Version must be at least with Year.Month or Version can be Full Year.Month.Day and can also contains the metadata

If