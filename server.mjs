import express from 'express'
import { getPdf } from './index.mjs'
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express()

app.get('/get_pdf', async (req, res) => {
	await getPdf()
	res.sendFile(__dirname + '/main.pdf')
})

const PORT = 5000

app.listen(PORT, () => {
	console.log('Server is running')
})