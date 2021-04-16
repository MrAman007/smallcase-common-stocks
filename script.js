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

const base_url = "https://smallcase.zerodha.com";

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
        const sc1Pr = getStocks(smallcases[0], browserInstance);
        const sc2Pr = getStocks(smallcases[1], browserInstance);
        const [sc1, sc2] = await Promise.all([sc1Pr, sc2Pr]);
        const commonStocks = getCommon(sc1, sc2);
        if (commonStocks.length > 1) {
            await createSmallcase(commonStocks, browserInstance);
            console.log("DONE");
        } else {
            console.log(commonStocks);
        }
    } catch (err) {
        console.log(err);
    }
})();

async function login(tab) {
    await tab.goto(base_url);
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

async function createSmallcase(commonStocks, browserInstance) {
    const newTab = await browserInstance.newPage();
    await newTab.goto(base_url);
    await waitAndClick("a:last-child", newTab);
    for (const stock of commonStocks) {
        await waitAndType(".input-focus", stock, newTab, 100);
        await newTab.waitForTimeout(2000);
        await waitAndClick("#react-autowhatever-1--item-0", newTab);
    }
    //save draft button
    await newTab.waitForTimeout(2000);
    await waitAndClick(
        ".btn.btn-lg.btn-fw.btn-secondary-blue.mt16.mb32",
        newTab
    );
    await waitAndType(
        ".SmallcaseMeta__input-smallcase-name__2XSQD.form-control.full.input.text-14",
        "my new smallcase",
        newTab
    );
    await waitAndType(
        ".SmallcaseMeta__input-smallcase-description__ZFbzN.form-control.full.input.text-14",
        "quality stocks",
        newTab
    );

    await waitAndClick("button[type='submit']", newTab);

    //save smallcase
    await newTab.waitForTimeout(2000);
    return waitAndClick(
        ".btn.btn-lg.btn-fw.btn-secondary-blue.mt16.mb32",
        newTab
    );
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
// a:nth-child(3)
// .input-focus
// react-autowhatever-1--item-0
// .btn.btn-lg.btn-fw.btn-secondary-blue.mt16.mb32
// .SmallcaseMeta__input-smallcase-name__2XSQD.form-control.full.input.text-14
// .SmallcaseMeta__input-smallcase-description__ZFbzN.form-control.full.input.text-14
// button[type='submit']
