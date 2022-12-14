import puppeteer from 'puppeteer';

export const load = async () => {
	const browser = await puppeteer.launch();
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

	return {
		content
	};
};
