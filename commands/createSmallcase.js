"use strict";

const base_url = require("../utils/baseUrl");
const { waitAndClick, waitAndType } = require("../utils/utils");

async function createSmallcase(stocks, browserInstance) {
    const newTab = await browserInstance.newPage();
    await newTab.goto(base_url);
    await waitAndClick("a:last-child", newTab);
    for (const stock of stocks) {
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

module.exports = {
    createSmallcase,
};
