const mongoose = require('mongoose');
const express = require("express");
const router = express.Router();

const commentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },

});