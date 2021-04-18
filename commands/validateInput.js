"use strict";

const fs = require("fs");
const path = require("path");

function validateInput(input, smallcases) {
    if (input.length === 0) {
        console.log("NO INPUT GIVEN!!");
        return false;
    }
    const temp = getJsonData(input[0]);
    if (temp === false) {
        return false;
    } else {
        if (temp.hasOwnProperty("smallcase") && temp.smallcase.length > 1) {
            smallcases.push(...temp.smallcase);
            return true;
        } else {
            console.log("Invalid JSON");
            return false;
        }
    }
}

function getJsonData(filePath) {
    filePath = path.resolve(filePath);
    if (!fs.existsSync(filePath)) {
        console.log("JSON File NOT FOUND!!");
        return false;
    } else {
        return JSON.parse(fs.readFileSync(filePath));
    }
}

module.exports = {
    validateInput,
};
