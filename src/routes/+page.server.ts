import Nightmare from 'nightmare';

const loadContent = () => {
	return new Promise((resolve) => {
		const nightmare = new Nightmare();
		nightmare
			.goto(
				'https://webapps.supen.fi.cr/portal/stats/category1and3/serierentabilidadporrangos.aspx'
			)
			.click('#ctl00_MainContentPlaceHolder_GenerarSerieButton')
			.wait('#ctl00_MainContentPlaceHolder_TableRentabilidad > tbody:nth-child(1)')
			.evaluate(() => {
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

				const headers = Array.from(headersHtml);

				const result = headers.reduce((array, element) => {
					const text = element.textContent;
					if (text) {
						const trimmedText = text.trim();
						if (trimmedText) {
							return [...array, trimmedText];
						}
					}
					return array;
				}, [] as string[]);

				return result;
			})
			.end()
			.then((value) => resolve(value))
			.catch(() => {
				resolve('Error cargando el contenido de SUPEN');
			});
	});
};

export const load = async () => {
	const content = await loadContent();
	return {
		content
	};
};
