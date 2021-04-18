"use strict";

const fs = require("fs");
const path = require("path");

// list of valid options
const options = {
    "-h": "help",
};

function validateInput(input, smallcases, inputOption) {
    if (input.length === 0) {
        console.log("No INPUT given!\nTry node script.js -h for more info.");
        return false;
    }
    for (const i of input) {
        // if passed argument is a valid option then push it to inputOption list
        if (options.hasOwnProperty(i)) {
            inputOption.push(i);
            return true;
        } else {
            // if passed argument is invalid option then print error and return failure
            if (i.charAt(0) === "-") {
                console.log(
                    `invalid option -- ${i}\nTry 'node script.js -h' for more information.`
                );
                return false; //invalid input
            } else {
                // else push JSON data
                const temp = getJsonData(i);
                if (temp === false) {
                    console.log("Invalid Input!");
                    return false;
                } else {
                    if (
                        temp.hasOwnProperty("smallcase") &&
                        temp.smallcase.length > 1
                    ) {
                        smallcases.push(...temp.smallcase);
                        return true;
                    } else {
                        console.log("Invalid JSON");
                        return false;
                    }
                }
            }
        }
    }
}

function getJsonData(filePath) {
    filePath = path.resolve(filePath);
    if (!fs.existsSync(filePath)) {
        return false;
    } else {
        return JSON.parse(fs.readFileSync(filePath));
    }
}

module.exports = {
    validateInput,
};
