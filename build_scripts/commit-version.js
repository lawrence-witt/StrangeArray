/* Imports */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const packageLockJson = require('../package-lock.json');
const metaJson = require('../public/meta.json');


/* Current Version */

const appVersion = packageJson.version;


/* Validate ENV Variables */

const TYPE = process.env.TYPE;
const SUM = process.env.SUM;
let BODY = process.env.BODY;

const typeSchema = { major: 0, minor: 1, patch: 2 };

if (!TYPE || !Object.keys(typeSchema).includes(TYPE)) {
    throw new Error("Invalid or missing version type.");
};

if (!SUM) {
    throw new Error("Missing commit summary.");
};

if (BODY) {
    try {
        BODY = fs.readFileSync(path.join(__dirname, BODY), 'utf-8');
    } catch (e) {
        throw new Error("A body file was specified but could not be read. Check it exists in the same directory and includes a file extension.");
    };
};


/* Generate New Version */

const newVersion = appVersion.split('.').map((n, i) => {
    const target = typeSchema[TYPE];
    if (i === target) {
        return (Number(n)+1).toString();
    } else if (i > target) {
        return "0";
    };
    return n;
}).join('.');

console.log(`New version number is: ${newVersion}.`);


/* Validate Commit Summary */

const commitSummary = `${newVersion} - ${SUM}`;

if (commitSummary.length > 72) {
    throw new Error(`Commit summaries should be <= 72 characters. Current length including version number: ${commitSummary.length}.`);
};


/* Update package.json, package-lock.json, meta.json */

const stringifyJsonData = (existing, version) => (JSON.stringify({
    ...existing,
    version
}, null, 2));

const updateSchema = {
    "./package.json": stringifyJsonData(packageJson, newVersion),
    "./package-lock.json": stringifyJsonData(packageLockJson, newVersion),
    "./public/meta.json": stringifyJsonData(metaJson, newVersion)
};

Object.keys(updateSchema).forEach(path => {
    try {
        fs.writeFileSync(path, updateSchema[path], 'utf8');
        console.log(`${path} has been saved with the latest version number.`);
    } catch (e) {
        throw new Error(`An error occured while writing JSON to ${path}: ${e.message}.`);
    };
});

/* Stage and commit all changes with supplied git summary and body */
exec("git add -A", error => {
    if (error) {
        console.log(`Error staging version changes: ${error.message}.`);
        return;
    };
    console.log(`Version ${newVersion} changes staged.`);

    exec(`git commit -m "${commitSummary}" ${BODY ? `-m "${BODY}"` : ""}`, error => {
        if (error) {
            console.log(`Error committing version changes: ${error.message}`);
            return;
        };
        console.log(`Version ${newVersion} changes committed.`);
    });
});