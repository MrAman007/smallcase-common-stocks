"use strict";

const inquirer = require("inquirer");

module.exports = {
    askForInput() {
        const questions = [
            {
                name: "operation",
                type: "list",
                message: "What do you wanna do ?",
                choices: [
                    "get stocks",
                    "get common stocks",
                    "create smallcase of common stocks",
                ],
            },
            {
                name: "username",
                type: "input",
                message: "Enter username of your zerodha account:",
                validate(val) {
                    if (val.length) {
                        return true;
                    } else {
                        return "Please enter your username!";
                    }
                },
            },
            {
                name: "password",
                type: "password",
                message: "Enter password:",
                validate(val) {
                    if (val.length) {
                        return true;
                    } else {
                        return "Please enter a valid password";
                    }
                },
            },
            {
                name: "pin",
                type: "password",
                message: "Enter pin:",
                validate(val) {
                    if (val.length) {
                        return true;
                    } else {
                        return "Please enter a valid pin";
                    }
                },
            },
        ];
        return inquirer.prompt(questions);
    },
    askForNumOfSmallcases() {
        const question = [
            {
                name: "num",
                type: "input",
                message: "Enter number of smallcases:",
                validate(val) {
                    if (Number.isFinite(+val)) {
                        return true;
                    } else {
                        return "Please enter a valid number";
                    }
                },
            },
        ];
        return inquirer.prompt(question);
    },
    askForSmallcase() {
        const question = [
            {
                name: "smallcase",
                type: "input",
                message: "Enter smallcase link:",
                validate(val) {
                    if (val.length) {
                        return true;
                    } else {
                        return "Please enter a valid link";
                    }
                },
            },
        ];
        return inquirer.prompt(question);
    },

    
};
