const log = require('../logger');

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'colossus.ikgptu@gmail.com',
        pass: 'jsrumrvfgtemtalq'
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const mailOptions = {
            from: '"Colossus" <colossus.ikgptu@gmail.com>',
            to,
            subject,
            html,
            
        };
        await transporter.sendMail(mailOptions);
        log.info('Email sent successfully');
    } catch (error) {
        log.error('Error sending email:', error);
    }
}

module.exports = {
    sendEmail
}