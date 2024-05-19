// const User = require('../models/user');
const Post = require('../models/post');
const { findOne } = require('../models/user');

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

exports.getPost = async (req, res, next) => {
   try{
    const postId = req.params.postId;
    const userId = req.session.user._id;

    const findingPost = await Post.findOne({_id: postId, userId: userId});

    res.render('user/edit-post', {
        pageTitle: 'Edit Post',
        path: '/edit-post',
        post: findingPost,
        isAuthenticated: req.session.isLoggedIn
    })
   } catch(err) {
    console.log(err);
   }
}

exports.editPost = async (req, res, next) => {
    try {
        const postId = req.body.postId;
        const userId = req.session.user._id
    
        const findingPost = await Post.findOne({_id:postId, userId: userId});
    
        findingPost.title = req.body.title;
        findingPost.image = req.body.imageUrl;
        findingPost.description = req.body.description;
    
         await findingPost.save();
         res.redirect('/');
    } catch(err) {
        console.log(err);
    }
}

exports.postDelete = async (req, res, next) => {
    const postId = req.params.postId;
    await Post.deleteOne({_id: postId});
    res.redirect('/');
}