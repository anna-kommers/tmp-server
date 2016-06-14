let express = require('express'),
  router = express.Router(),
  senderConfig = require('../config/mail_sender.json'),
  nodemailer = require('nodemailer'),
  smtpTransport = require('nodemailer-smtp-transport'),
  path = require('path'),
  fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('mail_sender', {
    title: 'Mail sender',
    mailList: senderConfig.mailList
  });
});

router.get('/:action', function(req, res, next) {
  req.params.action != 'send' && res.send('unknown request');


  let transporter = nodemailer.createTransport(smtpTransport(senderConfig.smtpTransport)),
    file = fs.readFileSync(path.join(__dirname, '/../public/docs/mail.html'), 'utf8'),
    mailOptions = {
      from: senderConfig.smtpTransport.auth.user,
      to: senderConfig.mailList,
      subject: 'MAIL SENDING TEST',
      text: 'Testing HTML formated email',
      html: file
    };

  transporter.sendMail(mailOptions, function(error, info){
    if(error){
      console.log('---------- ERROR --------------------');
      return console.log(error);
    }
    console.log('Message sent: ' + info.response);
  });

  res.send('ok');
});

module.exports = router;
