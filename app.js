const express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
const app = express();
const morgan = require("morgan");

app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
	res.send("cool");
});

app.get("/get-books", (req, res) => {});

app.post("/get-books", async (req, res) => {
	// const result = await pdfBanks(req.body.q);
	// res.send(result);
	url = `http://en.bookfi.net/s/?q=linear+algebra&t=0`;
	const pdfdrive = [];
	request(url, function (error, response, html) {
		if (!error) {
			const $ = cheerio.load(html);
			$(".resItemBox.exactMatch").each((i, el) => {
				if (i < 20) {
					console.log($("h3").text(), i);
				}

				// const item = {
				// 	name: $(el).find("h2").text(),
				// 	page: $(el).find(".fi-pagecount ").text(),
				// 	size: $(el).find(".fi-size.hidemobile ").text(),
				// 	link:
				// 		"https://www.pdfdrive.com" + $(el).find(".ai-search").attr("href"),
				// };
				// pdfdrive.push(item);
			});
		}
		return pdfdrive;
	});
});

app.listen(3000, () => {
	console.log("server running");
});

function pdfBanks(q) {
	return new Promise((resolve, reject) => {
		url = `https://www.pdfdrive.com/${q}-books.html`;
		const pdfdrive = [];
		request(url, function (error, response, html) {
			if (!error) {
				const $ = cheerio.load(html);
				$(".col-sm").each((i, el) => {
					const item = {
						name: $(el).find("h2").text(),
						page: $(el).find(".fi-pagecount ").text(),
						size: $(el).find(".fi-size.hidemobile ").text(),
						link:
							"https://www.pdfdrive.com" +
							$(el).find(".ai-search").attr("href"),
					};
					pdfdrive.push(item);
				});
			}
			resolve(pdfdrive);
		});
	});
}
