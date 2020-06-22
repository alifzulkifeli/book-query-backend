const express = require("express");
var fs = require("fs");
var request = require("request");
var cheerio = require("cheerio");
const app = express();
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
	res.send("hello");
});

app.post("/get-books", async (req, res) => {
	const pdfdrive = await pdfBanks(req.body.q);
	const bookFi = await bookFii(req.body.q);
	res.send({ pdfdrive, bookFi });
});

app.listen(process.env.PORT || 3000, () => {
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
function bookFii(q) {
	return new Promise((resolve, reject) => {
		url = `http://en.bookfi.net/s/?q=${q}&t=0`;
		const bookFi = [];
		request(url, function (error, response, html) {
			if (!error) {
				const $ = cheerio.load(html);
				$(".resItemBox.exactMatch").each((i, el) => {
					const item = {
						name: $(el).find("h3").html(),
						fileType: $(el).find(".ddownload.color2").html().slice(10, 20),
						author: $(el).find("a").next().html(),
						sizeAndLang: $(el).find(".actionsHolder").children().next().text(),
						link: "http://en.bookfi.net/" + $(el).find("a").attr("href"),
					};
					if (i < 20) bookFi.push(item);
				});
			}
			resolve(bookFi);
		});
	});
}
