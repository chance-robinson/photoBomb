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
    console.log(req.user);
    console.log(req.photo);
    console.log(req.body.description);
    console.log(req.body.photo);
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
// router.get("/:id", async (req, res) => {
//     try {
//         let photo = await Photo.findOne({
//             _id: req.params.id,
//         });
//         let comments = await Comment.find().sort({
//             created: -1
//         });
//         return res.send(comments);
//     } catch (error) {
//         //console.log(error);
//         return res.sendStatus(500);
//     }
// });

// edit a comment
// router.put("/:id", upload.single('photo'), async (req, res) => {
//         let photo = await Photo.findOne({
//             _id: req.params.id,
//         });
//         if (req.file) {
//             photo.path = "/images/" + req.file.filename;
//         }
//         photo.title = req.body.title;
//         photo.description = req.body.description;
//     try {
//             await photo.save();
//             return res.sendStatus(200);
//     } catch (error) {
//         //console.log(error);
//         return res.sendStatus(500);
//     }
// });

// delete a comment
// router.delete('/:id', async (req, res) => {
//     try {
//         await Photo.deleteOne({
//             _id: req.params.id
//         });
//         res.sendStatus(200);
//     } catch (error) {
//         //console.log(error);
//         res.sendStatus(503);
//     }
// });


//export model and routes
module.exports = {
    model: Comment,
    routes: router,
}