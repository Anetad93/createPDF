const nodemailer = require('nodemailer');
const config = require('./config')

let transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    auth: {
        user: config.myAddressEmail,
        pass: config.passwordEmail
    }
});

const message = {
    from: config.myAddressEmail,
    to: config.addresseeEmail,
    subject: 'Test1',
    text: 'Wysłałam!',
    attachments: [{
        filename: 'test.txt',
        content: 'trelemorele'
    }
    ]
};

transport.sendMail(message, function (err, info) {
    if (err) {
        console.log(err)
    } else {
        console.log(info);
    }
});
