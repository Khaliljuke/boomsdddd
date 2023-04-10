import nodemailer from 'nodemailer';
import mailer from "nodemailer"
import hbs from "nodemailer-express-handlebars"
import path from "path";


export async function verificationMail(req,user){
    var from = "Codemagicien team"
    var to = user.email
    var subject = "Let's verify your account"

    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
    })
    const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve('./templates/'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./templates/'),
        extName: ".handlebars",
      }
    transporter.use('compile', hbs(handlebarOptions));
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        template: 'verifMail',
        context: {
            host: req.get('host'),
            email: user.email,
            username: user.username,
        }      
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log("Email Sent: " + info.response)
        }
    })
}



export async function forgotpasswordMail(req,user){
    var from = "Codemagicien team"
    var to = user.email
    var subject = "Forgot Password"

    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
    })
    const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve('./templates/'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./templates/'),
        extName: ".handlebars",
      }
    transporter.use('compile', hbs(handlebarOptions));
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        template: 'forgotPassword',
        context: {
            host: req.get('host'),
            email: user.email,
            otp: user.otp,
            username: user.username,
        }      
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log("Email Sent: " + info.response)
        }
    })
}



export async function activationMail(req,user){
    var from = "Codemagicien team"
    var to = user.email
    var subject = "Account Activation"

    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
    })
    const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve('./templates/'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./templates/'),
        extName: ".handlebars",
      }
    transporter.use('compile', hbs(handlebarOptions));
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        template: 'activateAccount',
        context: {
            host: req.get('host'),
            email: user.email,
            username: user.username,
        }      
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log("Email Sent: " + info.response)
        }
    })
}



export async function gitMail(req,user,link){
    var from = "Codemagicien team"
    var to = user.email
    var subject = "Github Repository"

    var transporter = mailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD
        }
    })
    const handlebarOptions = {
        viewEngine: {
          extName: ".handlebars",
          partialsDir: path.resolve('./templates/'),
          defaultLayout: false,
        },
        viewPath: path.resolve('./templates/'),
        extName: ".handlebars",
      }
    transporter.use('compile', hbs(handlebarOptions));
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        template: 'gitRepoMail',
        context: {
            host: req.get('host'),
            email: user.email,
            username: user.username,
            link: link,
        }      
      };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log("Email Sent: " + info.response)
        }
    })
}



const sendMail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            pool: true,
            host: "smtp.gmail.com",
            port: 456,
            secure: true,
            auth: {
                user: process.env.SENDER,
                pass: process.env.PASSWORD,
            },
        });
        await transporter.sendMail({
            from: process.env.SENDER,
            to: email,
            subject: subject,
            html: text,
        });
        console.log("check that mailbox")
    } catch(error) {
        console.log(error);
    }
}


export default sendMail;