import fs from 'fs';
import AWS from 'aws-sdk'
import handlebars from 'handlebars';
// import chromium from 'chrome-aws-lambda'
import puppeteer from 'puppeteer'


function patientName(name = '', age = '', gender = '') {
	if (gender.toLowerCase() == 'male') { gender = 'M'; } else if (gender.toLowerCase() == 'female') { gender = 'F'; }
	return `${name} (${age} ${gender})`;
}

function orderIndex(index) {
	return index + 1;
}
function isAdditionalDetails(outsideReferral, authorizationRequired, options) {
	if (outsideReferral || authorizationRequired) {
		return options.fn(this);
	}
	return options.inverse(this);
}

handlebars.registerHelper('patientName', patientName);
handlebars.registerHelper('orderIndex', orderIndex);
handlebars.registerHelper('isAdditionalDetails', isAdditionalDetails);


const data = JSON.parse(fs.readFileSync('template.json', 'utf-8'));
const html = fs.readFileSync('template.html', 'utf-8');

const template = handlebars.compile(html);

const finalHtml = template(data);

console.log('finalHtml is ready');


const addToS3 = (pdf) => {
	return new Promise((resolve, reject) => {
		try {
			const s3 = new AWS.S3()
			s3.putObject({ Bucket: 'janshu-pdfs', Key: Math.random().toString(36) + '.pdf', Body: pdf }, (err, data) => {
				if (err) reject(err)
				console.log(err, data)
				resolve(data)
			})
		} catch (err) {
			reject(err)
		}
	})



}




export const getPdf = async () => {
	console.log('pdf is woking');

	const browser = await puppeteer.launch({
		headless: true,
	});

	console.log('43');

	const page = await browser.newPage();

	await page.setContent(finalHtml, { waitUntil: 'networkidle0' });
	console.log('48');

	const pdf = await page.pdf({ format: 'A4', path: 'main.pdf', printBackground: true });

	// addToS3(pdf)
	console.log('53');


	await browser.close();
	console.log('73');


};