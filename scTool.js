"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const { validateInput } = require("./utils/validateInput");
const { help } = require("./utils/help");
const {
    waitAndClick,
    waitAndType,
    createJSON,
    createExcelCommon,
} = require("./utils/utils");
const { getStocks } = require("./commands/getStocks");
const { getCommon } = require("./commands/getCommon");

// getting zerodha username and password
const { user: userid, password, pin } = JSON.parse(
    fs.readFileSync("/home/aman/Documents/.private/secret.json")
);

// homepage url
const base_url = "https://smallcase.zerodha.com";

//cli input
const input = process.argv.slice(2);

const smallcases = [];
const inputOption = [];

//validating input
const isValid = validateInput(input, smallcases, inputOption);

if (!isValid) {
    return;
}

if (inputOption.includes("-help")) {
    help();
    return;
}

//main function
(async () => {
    try {
        const browserInstance = await puppeteer.launch({
            headless: false,
            args: ["--start-maximized"],
            defaultViewport: null,
        });

        let pages = await browserInstance.pages();
        const tab1 = pages[0];
        await login(tab1);

        if (inputOption.length === 0 || inputOption.includes("-get")) {
            const stockArrPromise = [];
            for (const sc of smallcases) {
                stockArrPromise.push(getStocks(sc, browserInstance));
            }
            const stockArr = await Promise.all(stockArrPromise);
            createJSON(stockArr, __dirname);
        } else if (inputOption.includes("-common")) {
            if (smallcases.length > 1) {
                const commonStocksObj = await getCommon(
                    smallcases[0],
                    smallcases[1],
                    browserInstance
                );
                console.log(commonStocksObj);
            } else {
                console.log(
                    "TWO smallcase required for getting common stocks, got ONE!"
                );
            }
        }
    } catch (err) {
        console.log(err);
    }
})();

//login function
async function login(tab) {
    await tab.goto(base_url);
    await waitAndClick("button.LoginButton__small__cr6GJ", tab);
    await waitAndType("input[type='text']", userid, tab, 200);
    await waitAndType("input[type='password']", password, tab, 200);
    await tab.keyboard.press("Enter");
    await waitAndType("#pin", pin, tab);
    return waitAndClick("button[type='submit']", tab);
}

// const sc1Pr = getStocks(smallcases[0], browserInstance);
// const sc2Pr = getStocks(smallcases[1], browserInstance);
// const [sc1, sc2] = await Promise.all([sc1Pr, sc2Pr]);
// const commonStocks = getCommon(sc1, sc2);
// pages = await browserInstance.pages();
// const currentTab = pages[pages.length - 1];
// if (commonStocks.stocks.length >= 2) {
//     const answer = await currentTab.evaluate((commonStocks) => {
//         const answer = prompt(`Found ${commonStocks.stocks.length} common stocks!

// Choose an operation (1-5):
// 1. Create new smallcase of common stocks.
// 2. Create Excel file of stocks.
// 3. Create JSON file of stocks.
// 4. Print stocks on console.
// 5. All of the above.`);

//         return answer;
//     }, commonStocks);

//     if (answer == 1) {
//         await createSmallcase(commonStocks.stocks, browserInstance);
//     } else if (answer == 2) {
//         createExcel(commonStocks);
//     } else if (answer == 3) {
//         createJSON(commonStocks);
//     } else if (answer == 4) {
//         console.table(commonStocks);
//     } else if (answer == 5) {
//         createExcel(commonStocks);
//         createJSON(commonStocks);
//         console.table(commonStocks);
//         await createSmallcase(commonStocks.stocks, browserInstance);
//     } else {
//         console.log("INVALID INPUT");
//     }
// } else if (commonStocks.stocks.length > 0) {
//     const answer = await currentTab.evaluate((commonStocks) => {
//         const answer = prompt(`Found ${commonStocks.stocks.length} common stocks!

// For creating a new smallcase 2 or more stocks required.

// Choose from available options below (1-4):
// 1. Create Excel file of stocks.
// 2. Create JSON file of stocks.
// 3. Print stocks on console.
// 4. All of the above.`);

//         return answer;
//     }, commonStocks);

//     if (answer == 1) {
//         createExcel(commonStocks);
//     } else if (answer == 2) {
//         createJSON(commonStocks);
//     } else if (answer == 3) {
//         console.table(commonStocks);
//     } else if (answer == 4) {
//         createExcel(commonStocks);
//         createJSON(commonStocks);
//         console.table(commonStocks);
//     } else {
//         console.log("INVALID INPUT");
//     }
// } else {
//     await currentTab.evaluate(() => {
//         alert(`Found 0 common stocks! Try with different smallcases.`);
//     });
// }
