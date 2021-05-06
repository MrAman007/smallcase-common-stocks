"use strict";

//libraries
const figlet = require("figlet");
const chalk = require("chalk");
const puppeteer = require("puppeteer");
const clear = require("clear");
// local lib
const {
    askForInput,
    askForNumOfSmallcases,
    askForSmallcase,
} = require("./lib/input");
const {
    waitAndClick,
    waitAndType,
    createJSON,
    createExcelCommon,
    createExcel,
} = require("./lib/utils");
const { getStocks } = require("./lib/getStocks");
const { getCommon } = require("./lib/getCommon");
const { createSmallcase } = require("./lib/createSmallcase");

const base_url = require("./lib/baseUrl");

//Script Launch Display
clear();
console.log(
    chalk
        .hex("#2c7fe1")
        .bold(figlet.textSync("smallcase-tool", { horizontalLayout: "full" }))
);

//Functions
const getInput = async function () {
    const input = await askForInput();
    return input;
};

const getNumOfSmallcase = async function () {
    const { num } = await askForNumOfSmallcases();
    return num;
};

const getSmallcase = async function () {
    const { smallcase } = await askForSmallcase();
    return smallcase;
};

//login function
async function login(tab, username, password, pin) {
    await tab.goto(base_url);
    await waitAndClick("button.LoginButton__small__cr6GJ", tab);
    await waitAndType("input[type='text']", username, tab, 200);
    await waitAndType("input[type='password']", password, tab, 200);
    await tab.keyboard.press("Enter");
    await waitAndType("#pin", pin, tab);
    return waitAndClick("button[type='submit']", tab);
}

(async () => {
    try {
        const input = await getInput();
        const browserInstance = await puppeteer.launch({
            headless: false,
            args: ["--start-maximized"],
            defaultViewport: null,
        });

        let pages = await browserInstance.pages();
        const tab1 = pages[0];
        await login(tab1, input.username, input.password, input.pin);

        const smallcases = [];
        if (input.operation == "get stocks") {
            let num = await getNumOfSmallcase();
            while (num--) {
                smallcases.push(await getSmallcase());
            }
            const stockArrPromise = [];
            for (const sc of smallcases) {
                const stocks = getStocks(sc, browserInstance);
                stockArrPromise.push(stocks);
            }
            const stocksArr = await Promise.all(stockArrPromise);
            console.log(stocksArr);
            createJSON(stocksArr, "./");
            createExcel(stocksArr, "./");
        } else if (input.operation == "get common stocks") {
            for (let i = 0; i < 2; i++) {
                const sc = await getSmallcase();
                smallcases.push(sc.trim());
            }
            const commonStocks = await getCommon(
                smallcases[0],
                smallcases[1],
                browserInstance
            );
            console.log(commonStocks);
            createJSON(commonStocks, "./");
            createExcelCommon(commonStocks, "./");
        } else if (input.operation == "create smallcase of common stocks") {
            for (let i = 0; i < 2; i++) {
                const sc = await getSmallcase();
                smallcases.push(sc.trim());
            }

            const commonStocks = await getCommon(
                smallcases[0],
                smallcases[1],
                browserInstance
            );

            createSmallcase(commonStocks, browserInstance);
        }
    } catch (err) {
        console.log(err);
    }
})();
