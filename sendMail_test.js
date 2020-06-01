const nodemailer = require('nodemailer');
const config = require('./config')
const Excel = require('exceljs');
let fs = require('fs');
let path = require('path');
let docxConverter = require('docx-pdf');
let PizZip = require("pizzip")
let Docxtemplater = require('docxtemplater');
let excelCreat = require('excel4node');
let xlsx = require('xlsx')

let workbook = new Excel.Workbook();


function convertDocxToPdf(inputPath, outputPath) {
    return new Promise((accept, reject) => {
        docxConverter(inputPath, outputPath, (err, result) => {
            if (err) reject(err);
            else accept();
        });
    })
}

function sendEmail(addressee, name, attachment) {

    let transport = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        auth: {
            user: config.myAddressEmail,
            pass: config.passwordEmail
        }
    });

    let message = {
        from: config.myAddressEmail,
        to: addressee,
        subject: 'Wezwanie do zapłaty - ' + name,
        text: 'Proszę o zapoznanie się z treścią załącznika.',
        attachments: [{
            filename: name + '.pdf',
            path: path.join(__dirname, '../creatPDF/output ' + name + '.pdf'),
            contentType: 'application/pdf'
        }],
    };

    transport.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    });
}

function generatePdf(data) {
    let content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    let zip = new PizZip(content);
    let doc = new Docxtemplater(zip);

    doc.setData(data);
    doc.render()

    let buf = doc.getZip().generate({type: 'nodebuffer'});

    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);

    return convertDocxToPdf('./output.docx', './output ' + data.name + '.pdf')
}


workbook.xlsx.readFile("test.xlsx").then(async () => {
    let worksheet = workbook.getWorksheet("Studenci");

    for (let i = 2; worksheet.getCell(i, 1).value !== null; i++) {

        let information = {
            name: worksheet.getCell(i, 3).value,
            email: worksheet.getCell(i, 5).value,
            status: worksheet.getCell(i, 6).value
        }

        let result = await generatePdf(information)

        if (information.status === 1) {
        } else {
            sendEmail("aneta.duzynska@gmail.com", information.name, 'output ' + information.name + '.pdf')
            console.log("jestem tu i wysłałam")
            worksheet.getCell(i, 6).value = 1
        }

    }
    workbook.xlsx.writeFile('test.xlsx').then( result => result)
}).catch(err => console.log(err));
