const express = require('express');
const fs = require('fs');


const app = express();
app.use(express.json());
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "http://localhost:3300"); // update to match the domain you will make the request from
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.use('/', express.static('dist/public'));


app.post('/api/crews', (req, res) => {
	fs.readFile('dist/server/db/crews_info.json', 'utf-8', (err, data) => {
			if (err) {
				//Файл не найден.
				res.sendStatus(404, JSON.stringify({ result: 0, text: 'err'}));
			} else {
				let payload = {
						code: 0,
						descr: 'OK',
						data: {}
				};

				let data_body = {};
				data_body.crews_info = JSON.parse(data);
				payload.data = data_body;
				
				res.send(JSON.stringify(payload));
			}
	})
})

app.post('/api/order', (req, res) => {
	fs.readFile('dist/server/db/order_info.json', 'utf-8', (err, data) => {
			if (err) {
				//Файл не найден.
				res.sendStatus(404, JSON.stringify({ result: 0, text: 'err'}));
			} else {
				res.send(JSON.stringify(data));
			}
	})
})

app.listen(3000, () => console.log('listen on port 3000.'));
