// const User = require('../models/user');
const Post = require('../models/post');

exports.getHomepage = async (req, res, next) => {

    try {
        const posts = await Post.find();

        res.render('global/homepage',{
            pageTitle:'Home',
            path:'/',
            isAuthenticated: req.session.isLoggedIn,
            posts: posts
        })
    } catch(err) {
        console.log(err);
    }
}

exports.getShare = (req, res, next) => {
    res.render('user/share',{
        pageTitle:'Share',
        path:'/share',
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postShare = async (req, res, next) => {
    
    try {

    const title = req.body.title ;
    const description = req.body.description;
    const imageUrl = req.body.imageUrl;
    const userId = req.session.user._id;

    const newPost = new  Post({title: title, description: description, imageUrl: imageUrl, userId: userId});
    await newPost.save();
    res.redirect('/');
    } catch(err) {
        console.log(err);
    }

}