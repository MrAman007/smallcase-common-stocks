"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const { validateInput } = require("./utils/validateInput");
const { help } = require("./utils/help");
const {
    waitAndClick,
    waitAndType,
    createJSON,
    createExcelCommon,
    createExcel,
} = require("./utils/utils");
const { getStocks } = require("./commands/getStocks");
const { getCommon } = require("./commands/getCommon");
const { createSmallcase } = require("./commands/createSmallcase");

// getting zerodha username and password
const { user: userid, password, pin } = JSON.parse(
    fs.readFileSync("/home/aman/Documents/.private/secret.json")
);

const base_url = require("./utils/baseUrl");

//cli input
const input = process.argv.slice(2);

const smallcases = [];
const inputOption = [];

//validating input
const isValid = validateInput(input, smallcases, inputOption);

if (inputOption.includes("-help")) {
    help();
    return;
}

if (!isValid) {
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
            pages = await browserInstance.pages();
            const currentTab = pages[pages.length - 1];
            const choice = await currentTab.evaluate((stockArr) => {
                const answer = prompt(`Found ${stockArr.length} stocks!
                
Choose an operation (1-5):
    1. Create JSON file of stocks.
    2. Create Excel file of stocks.
    3. Print on Console.
    4. All of the Above.`);

                return answer;
            }, stockArr);

            if (choice == 1) {
                createJSON(stockArr, path.join(__dirname, "data"));
            } else if (choice == 2) {
                createExcel(stockArr, path.join(__dirname, "data"));
            } else if (choice == 3) {
                console.table(stockArr);
            } else if (choice == 4) {
                createJSON(stockArr, path.join(__dirname, "data"));
                createExcel(stockArr, path.join(__dirname, "data"));
                console.table(stockArr);
            } else {
                console.log("INVALID INPUT");
            }
        } else if (inputOption.includes("-common")) {
            if (smallcases.length > 1) {
                const commonStocksObj = await getCommon(
                    smallcases[0],
                    smallcases[1],
                    browserInstance
                );
                pages = await browserInstance.pages();
                const currentTab = pages[pages.length - 1];
                if (commonStocksObj.stocks.length >= 2) {
                    const answer = await currentTab.evaluate(
                        (commonStocksObj) => {
                            const answer = prompt(`Found ${commonStocksObj.stocks.length} common stocks!

Choose an operation (1-5):
    1. Create new smallcase of common stocks.
    2. Create Excel file of stocks.
    3. Create JSON file of stocks.
    4. Print on console.
    5. All of the above.`);

                            return answer;
                        },
                        commonStocksObj
                    );

                    if (answer == 1) {
                        await createSmallcase(
                            commonStocksObj.stocks,
                            browserInstance
                        );
                    } else if (answer == 2) {
                        createExcelCommon(
                            commonStocksObj,
                            path.join(__dirname, "data")
                        );
                    } else if (answer == 3) {
                        createJSON(
                            commonStocksObj,
                            path.join(__dirname, "data")
                        );
                    } else if (answer == 4) {
                        console.table(
                            commonStocksObj,
                            path.join(__dirname, "data")
                        );
                    } else if (answer == 5) {
                        createExcelCommon(
                            commonStocksObj,
                            path.join(__dirname, "data")
                        );
                        createJSON(
                            commonStocksObj,
                            path.join(__dirname, "data")
                        );
                        console.table(commonStocksObj);
                        await createSmallcase(
                            commonStocksObj.stocks,
                            browserInstance
                        );
                    } else {
                        console.log("INVALID INPUT");
                    }
                } else if (commonStocksObj.stocks.length > 0) {
                    const answer = await currentTab.evaluate(
                        (commonStocksObj) => {
                            const answer = prompt(`Found ${commonStocksObj.stocks.length} common stocks!

For creating a new smallcase 2 or more stocks required.

Choose from available options below (1-4):
1. Create Excel file of stocks.
2. Create JSON file of stocks.
3. Print stocks on console.
4. All of the above.`);

                            return answer;
                        },
                        commonStocks
                    );

                    if (answer == 1) {
                        createExcelCommon(commonStocks);
                    } else if (answer == 2) {
                        createJSON(commonStocks, path.join(__dirname, "data"));
                    } else if (answer == 3) {
                        console.table(commonStocks);
                    } else if (answer == 4) {
                        createExcelCommon(commonStocks);
                        createJSON(commonStocks, path.join(__dirname, "data"));
                        console.table(commonStocks);
                    } else {
                        console.log("INVALID INPUT");
                    }
                } else {
                    await currentTab.evaluate(() => {
                        alert(
                            `Found 0 common stocks! Try with different smallcases.`
                        );
                    });
                }
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
