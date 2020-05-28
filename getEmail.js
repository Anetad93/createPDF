const fetch = require('node-fetch');
const parseHtml = require('node-html-parser').parse
const config = require('./config')

function loadMailsFromUnibase() {
    const respEmail = fetch("https://r.unibase.pl/55", {
        "headers": {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
            "accept-language": "pl-PL,pl;q=0.9,en-US;q=0.8,en;q=0.7",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            'Cookie': '_ga=GA1.2.745731147.1572898705; lan=pl; _ym_d=1590059062; _ym_uid=1590059062935480695; _gid=GA1.2.1801098621.1590590701; _ym_isad=1; uid=1914; logged_in=' + config.password
        },
        "referrer": "https://r.unibase.pl/0",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": null,
        "method": "GET",
        "mode": "cors"
    });

     return respEmail.then(result => {
         return result.text().then(html => {
             let root = parseHtml(html)
             let allAdresEmail = []
             let allEmails = []

             for (let row of root.querySelectorAll("tbody tr")) {
                 let numberUid = parseInt(row.childNodes[1].rawText) // Pobiera kolumnę z nr id
                 let adressEmail = row.childNodes[11].lastChild.rawText // Pobiera kolumnę z nr telefonu i adresem e-mail

                 if (adressEmail.indexOf('@') > -1) {
                     allAdresEmail.push({
                         id: numberUid, email: adressEmail
                     })
                 } else {
                     allAdresEmail.push({
                         id: numberUid, email: ""
                     })
                 }
             }
             return allAdresEmail

         });
     })  ;
}

module.exports = {loadMailsFromUnibase}

