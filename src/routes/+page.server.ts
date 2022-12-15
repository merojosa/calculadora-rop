import puppeteer from 'puppeteer-core';
import chromium from 'chrome-aws-lambda';

export const load = async () => {
	const path = await chromium.executablePath;
	const browser = await puppeteer.launch({
		args: chromium.args,
		executablePath: path,
		headless: true
	});
	const page = await browser.newPage();

	await page.goto(
		'https://webapps.supen.fi.cr/portal/stats/category1and3/serierentabilidadporrangos.aspx'
	);
	page.click('#ctl00_MainContentPlaceHolder_GenerarSerieButton');
	await page.waitForNetworkIdle();

	const rawData = await page.evaluate(() => {
		const table = document.getElementById('TableResult');
		if (!table) {
			return null;
		}

		const headersHtml = table.querySelectorAll(
			'table > tbody > tr > th > table > tbody > tr:first-child'
		);

		if (!headersHtml.length) {
			return null;
		}

		const banks = [] as string[];
		headersHtml.forEach((value) => {
			const content = value.textContent?.trim();
			if (content?.length) {
				return banks.push(content);
			}
		});

		return banks;
	});

	const content = rawData;

	await browser.close();
	return {
		content
	};
};
