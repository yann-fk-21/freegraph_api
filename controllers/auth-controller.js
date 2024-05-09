const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');


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

exports.postSignIn = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    const findingUser = await User.findOne({email:email});
    if(!findingUser){
        return res.redirect('/sign-up')
    }

    const isMatch = await bcrypt.compare(password, findingUser.password);
    if(!isMatch){
      return res.redirect('/sign-in')
    } else {
        req.session.user = findingUser;
        req.session.isLoggedIn = true;

        transporter.sendMail({
            to:email,
            from: 'yannfonkoue@gmail.com',
            subject:'Alert: Sign In is sucessfully',
            html:` <html>
            <body>
                <h1>Welcome to FreeGraph!</h1>
                <p>Thank you for signing in. We are excited to have you on board.</p>
                <p>Start exploring and connecting with other users to unleash the power of FreeGraph.</p>
                <p>Best regards,</p>
                <p>The FreeGraph Team</p>
                <p>🎉🎉🎉</p>
            </body>
            </html>`
        })

        return res.redirect('/');
    }
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err)=>{
        console.log(err);
        res.redirect('/');
    })
}

exports.getResetPassword = (req, res, next) => {
    res.render('auth/reset', {
        pageTitle:'Reset password',
        path:'/reset',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postResetPassword = (req, res, next) => {
    
    crypto.randomBytes(12, (async (err, buffer)=>{
        if(err){
            return res.redirect('/reset')
        }

        const email = req.body.email;
        const token = buffer.toString("hex");
        
        const findingUser = await User.findOne({email: email});
        if(!findingUser){
            return res.redirect('/reset');
        }
    
        findingUser.resetToken = token,
        findingUser.resetTokenExpirated = Date.now() + 3600000 ;
        await findingUser.save();
    
        transporter.sendMail({
            to: email,
            from: 'yannfonkoue@gmail.com',
            subject:'Reset password',
            html:`<html>
            <body>
                <h1>Reset Password</h1>
                <p>We have received a request to reset your password. Please click the link below to reset your password:</p>
                <a href="https://symmetrical-space-telegram-wrv6j7q79qw5fv47p-3000.app.github.dev/reset/${token}">Reset Password</a>
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Best regards,</p>
                <p>The FreeGraph Team</p>
                <p>🔒🔑</p>
            </body>
            </html>`
        });
    
      return res.redirect('/')
    }))

}

exports.getNewPassword = async (req, res, next) => {

    const token = req.params.token;

    const findingUser = await User.findOne({resetToken:token, resetTokenExpirated:{$gt: Date.now()}})

    if(!findingUser){
        return res.redirect('/');
    }

    res.render('auth/new-password',{
        pageTitle:'New Password',
        path:'/new-password',
        isAuthenticated: req.session.isLoggedIn,
        token: token,
        userId: findingUser._id.toString()
    })
}

exports.postNewPassword = async (req, res, next) => {

    try {
        
        const password = req.body.password;
        const userId = req.body.userId;
        const token = req.body.token;
    
        const user = await User.findOne({_id: userId, resetToken: token, resetTokenExpirated:{$gt: Date.now()}});
    
        if(!user){
            return res.redirect('/');
        }
    
        const hashPassword = await bcrypt.hash(password, 12);
    
        user.password = hashPassword ;
        user.resetToken = undefined;
        user.resetTokenExpirated = undefined ;
    
        await user.save();
    
        return res.redirect('/sign-in');
    }catch(err){ 
        console.log(err)
    }
}