"use strict";

//function to get stocks of a smallcase
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
        const smallcaseName = document
            .querySelector("h1.SmallcaseProfileBanner__name__2ln5a")
            .innerText.trim();
        return {
            name: smallcaseName,
            stocks: stocks,
        };
    }, stockSelector);
}

module.exports = {
    getStocks,
};
