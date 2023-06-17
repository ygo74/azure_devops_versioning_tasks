"use strict";

import Q from 'q';
import fs = require('fs');

import * as xml2js from 'xml2js';

const stripBom = require('stripbom');

import * as path from "path";
import * as url from "url";
import * as tl from "azure-pipelines-task-lib/task";

function readXmlFileAsJson(filePath: string): Q.Promise<any> {
    return readFile(filePath, 'utf-8')
        .then(convertXmlStringToJson);
}

function readFile(filePath: string, encoding: string): Q.Promise<string> {
    return Q.nfcall<string>(fs.readFile, filePath, encoding);
}

async function convertXmlStringToJson(xmlContent: string): Promise<any> {
    return Q.nfcall<any>(xml2js.parseString, stripBom(xmlContent));
}


export function findVersionFile(versionfilepath: string) : string {

    // if (versionfilepath.indexOf('*') >= 0 || versionfilepath.indexOf('?') >= 0 ) {
        tl.debug('File version Pattern found : ' + versionfilepath);
    if (!tl.exist(versionfilepath)) {
        tl.debug('File version Pattern not found : ' + versionfilepath);
    }


    // }

    let result: string = "";
    readFile(versionfilepath, 'utf-8').then(res => {result = res});
    return result;
    return JSON.stringify(readXmlFileAsJson(versionfilepath));

    return "OK";

}

let result=findVersionFile("tests/pom.xml")
console.log('Result : ', result);
