const User = require('../models/user');

exports.getHomepage = (req, res, next) => {
    res.render('global/homepage',{
        pageTitle:'Home',
        path:'/',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.getShare = (req, res, next) => {
    res.render('user/share',{
        pageTitle:'Share',
        path:'/share',
        isAuthenticated: req.session.isLoggedIn
    })
}