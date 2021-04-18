"use strict";

const { getStocks } = require("./getStocks");

async function getCommon(url1, url2, browserInstance) {
    const sc1Pr = getStocks(url1, browserInstance);
    const sc2Pr = getStocks(url2, browserInstance);
    const [sc1, sc2] = await Promise.all([sc1Pr, sc2Pr]);
    const commonStocks = filterCommon(sc1, sc2);
    return commonStocks;
}

function filterCommon(s1, s2) {
    const stocks = s1.stocks.filter((stock) => s2.stocks.includes(stock));
    return {
        smallcases: [s1.name, s2.name],
        stocks: stocks,
    };
}

module.exports = {
    getCommon,
};
