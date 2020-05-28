const fetch = require('node-fetch');
const parseHtml = require('node-html-parser').parse
const excel = require('node-excel-export');
let excelCreat = require('excel4node');
const Excel = require('exceljs');
const mails = require('./getEmail')
const config = require('./config')

const resp = fetch("https://r.unibase.pl/53", {
    "credentials": "include",
    "headers": {
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-language": "en-US,en;q=0.9,pl;q=0.8",
        "cache-control": "max-age=0",
        "content-type": "application/x-www-form-urlencoded",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",
        "upgrade-insecure-requests": "1",
        'Cookie': '_ga=GA1.2.745731147.1572898705; lan=pl; _ym_d=1590059062; _ym_uid=1590059062935480695; _gid=GA1.2.1801098621.1590590701; _ym_isad=1; uid=1914; logged_in=' + config.password,
        "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.117 Safari/537.36",
    },
    "referrer": "https://r.unibase.pl/53",
    "referrerPolicy": "no-referrer-when-downgrade",
    "body": "sel_what=2&date_from=2020-05-01&date_to=2020-05-31",
    "method": "POST",
    "mode": "cors",
});

resp.then(result => {
    result.text().then(html => {
        let root = parseHtml(html)
        let workbook = new excelCreat.Workbook();
        let worksheet = workbook.addWorksheet('Studenci');

        worksheet.cell(1, 1).string("UiD")
        worksheet.cell(1, 2).string("Numer umowy")
        worksheet.cell(1, 3).string("Nazwisko i imię")
        worksheet.cell(1, 4).string("Saldo")
        worksheet.cell(1, 5).string("Adres e-mail")
        worksheet.cell(1, 6).string("Status")

        let a = 2

        mails.loadMailsFromUnibase().then(allAdresEmail => {

            for (let row of root.querySelectorAll("tbody tr")) {
                let deal = row.childNodes[1].rawText
                let name = row.childNodes[5].rawText
                let uid = parseInt(row.childNodes[7].rawText)
                let balance = parseFloat(row.childNodes[27].rawText.replace(/[,.]/g, m => (m === ',' ? '.' : ',')))

                if (balance < -2000) {
                    worksheet.cell(a, 1).number(uid)
                    worksheet.cell(a, 2).string(deal)
                    worksheet.cell(a, 3).string(name)
                    worksheet.cell(a, 4).number(balance)
                    worksheet.cell(a, 5).string(allAdresEmail.find(x => x.id === uid).email)
                    worksheet.cell(a, 6).number(0)
                    a++
                }
            }
            workbook.write('test.xlsx');
        })
    })
})
