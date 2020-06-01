const Excel = require('exceljs');

let workbook = new Excel.Workbook();

workbook.xlsx.readFile("test.xlsx").then(() => {
        let worksheet = workbook.getWorksheet("Studenci");

        worksheet.spliceRows(3, 1)
        workbook.xlsx.writeFile('test.xlsx').then(result => result)
    }
)
