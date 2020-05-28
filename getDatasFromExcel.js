const Excel = require('exceljs');
const mails = require('./getEmail')
let PizZip = require("pizzip")
let Docxtemplater = require('docxtemplater');
let fs = require('fs');
let path = require('path');
let docxConverter = require('docx-pdf');

let workbook = new Excel.Workbook();

function convertDocxToPdf(inputPath, outputPath) {
    return new Promise((accept, reject) => {
        docxConverter(inputPath, outputPath, (err, result) => {
            if (err) reject(err);
            else accept();
        });
    })
}

function generatePdf(data) {
    let content = fs.readFileSync(path.resolve(__dirname, 'input.docx'), 'binary');

    let zip = new PizZip(content);
    let doc = new Docxtemplater(zip);

    doc.setData(data);
    doc.render()

    let buf = doc.getZip().generate({type: 'nodebuffer'});

    fs.writeFileSync(path.resolve(__dirname, 'output.docx'), buf);

    return convertDocxToPdf('./output.docx', './output' + data.name + '.pdf')

    // docxConverter('./output.docx', './output.pdf', (err, result) => {
    //     if (err) console.log(err);
    //     else console.log(result); // writes to file for us
    // });
}

workbook.xlsx.readFile("test.xlsx").then(async () => {
    let worksheet = workbook.getWorksheet("Studenci");

    for (let i = 2; worksheet.getCell(i, 1).value !== null; i++) {

        let information = {
            name: worksheet.getCell(i, 3).value,
            email: worksheet.getCell(i, 5).value
        }

        // generatePdf(information).then(result => {
        //     console.log("wygenerowano pdf")
        // })

        let result = await generatePdf(information);

        console.log("wygenerowano pdf")
    }

}).catch(err => console.log(err));

