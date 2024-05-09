const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');


const transporter = nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key: process.env.API_KEY
    }
}))

exports.getSignUp = (req, res, next) => {
  res.render('auth/sign-up',{
        pageTitle:'Sign Up',
        path:'/sign-up',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postSignUp = async (req, res, next) => {

   const email = req.body.email ;
   const password = req.body.password;

   const user = await User.findOne({email: email});
   if(user) return res.redirect('/sign-in');
   
   
    bcrypt.hash(password, 12).then(hashPassword => {
        const newUser = new User({email:email, password:hashPassword});
        return newUser.save();
    }).then(result=>{
        transporter.sendMail({
            to:email,
            from:'yannfonkoue@gmail.com',
            subject: 'Welcome from freegraph - Sign up success',
            html: `<html>
            <body>
                <h1>Welcome to FreeGraph!</h1>
                <p>Thank you for signing up. We are excited to have you on board.</p>
                <p>Start exploring and connecting with other users to unleash the power of FreeGraph.</p>
                <p>Best regards,</p>
                <p>The FreeGraph Team</p>
            </body>
        </html>`
        })
        res.redirect('/sign-in');
    }).catch(err=>console.log(err))


}

exports.getSignIn = (req, res, next) => {
    res.render('auth/sign-in',{
        pageTitle:'Sign In',
        path:'/sign-in',
        isAuthenticated: req.session.isLoggedIn
    })
}