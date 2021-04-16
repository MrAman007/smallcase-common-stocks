"use strict";

const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const { user: userid, password, pin } = JSON.parse(
    fs.readFileSync("/home/aman/Documents/.private/secret.json")
);
const smallcases = [
    "https://smallcase.zerodha.com/smallcase/SCMO_0026",
    "https://smallcase.zerodha.com/smallcase/SCMO_0003",
];

(async () => {
    try {
        const browserInstance = await puppeteer.launch({
            headless: false,
            args: ["--start-maximized"],
            defaultViewport: null,
        });

        const pages = await browserInstance.pages();
        const tab1 = pages[0];
        await login(tab1);
        // const sc1Pr = getStocks(smallcases[0], browserInstance);
        // const sc2Pr = getStocks(smallcases[1], browserInstance);
        // const [sc1, sc2] = await Promise.all([sc1Pr, sc2Pr]);
        const sc1 = await getStocks(smallcases[0], browserInstance);
        const sc2 = await getStocks(smallcases[1], browserInstance);
        const commonStocks = getCommon(sc1, sc2);
        console.log(commonStocks);
    } catch (err) {
        console.log(err);
    }
})();

async function login(tab) {
    await tab.goto("https://smallcase.zerodha.com");
    await waitAndClick("button.LoginButton__small__cr6GJ", tab);
    await waitAndType("input[type='text']", userid, tab, 200);
    await waitAndType("input[type='password']", password, tab, 200);
    await tab.keyboard.press("Enter");
    await waitAndType("#pin", pin, tab);
    return waitAndClick("button[type='submit']", tab);
}

async function getStocks(url, browserInstance) {
    const newTab = await browserInstance.newPage();
    await newTab.goto(url);
    const stockTabSelector =
        "div.RouteTab__tab_border__2LY1- .RouteTab__tab__25-kK a";
    await newTab.waitForSelector(stockTabSelector);
    await newTab.evaluate((selector) => {
        const anchors = document.querySelectorAll(selector);
        const stockTabAnchor = anchors[1];
        stockTabAnchor.click();
    }, stockTabSelector);

    await newTab.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
    const stockSelector =
        "div.StocksWeights__column-left__3oEdJ .StocksWeights__stock-name__2ANv4";
    await newTab.waitForSelector(stockSelector);
    return newTab.evaluate((selector) => {
        const stockElements = document.querySelectorAll(selector);
        let stocks = [...stockElements].map((stock) => stock.innerText.trim());
        return stocks;
    }, stockSelector);
}

function getCommon(s1, s2) {
    return s1.filter((stock) => s2.includes(stock));
}

async function waitAndType(selector, text, tab, delay = 100) {
    await tab.waitForSelector(selector);
    return tab.type(selector, text, { delay: delay });
}

async function waitAndClick(selector, tab) {
    await tab.waitForSelector(selector);
    return tab.click(selector);
}

// div.RouteTab__tab_border__2LY1- .RouteTab__tab__25-kK a
// div.StocksWeights__column-left__3oEdJ .StocksWeights__stock-name__2ANv4 (stock name)
