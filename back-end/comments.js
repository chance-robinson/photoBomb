const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

//import user model
const users = require("./users.js");
const User = users.model;
const validUser = users.valid;

//import photo model
const photos = require("./photos.js");
const Photo = photos.model;

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    photo: {
        type: mongoose.Schema.ObjectId,
        ref: 'Photo'
    },
    description: String,
    created: {
        type: Date,
        default: Date.now
    },

});

const Comment = mongoose.model('Comment', commentSchema);

//API ENDPOINTS

// upload comment
router.post("/", validUser, async (req, res) => {
    // check parameters
    const comment = new Comment({
        user: req.user,
        photo: req.body.photo,
        description: req.body.description,
    });
    try {
        await comment.save();
        return res.sendStatus(200);
    } catch (error) {
        //console.log(error);
        return res.sendStatus(500);
    }
});

// get all comments for a photo
router.get("/:id", async (req, res) => {
    try {
        let comments = await Comment.find({
            photo: req.params.id
        }).sort({
            created: -1
        }).populate('user');;
        return res.send(comments);
    } catch (error) {
        //console.log(error);
        return res.sendStatus(500);
    }
});

//export model and routes
module.exports = {
    model: Comment,
    routes: router,
}