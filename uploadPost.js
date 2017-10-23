var mongoose=require('mongoose');
var User = require('./model');
var CommentPost = require('./commentPost');
var LikePost = require('./LikePost');


var uploadImageSchema = new mongoose.Schema({
    image:String,
    title:String,
    description:String,
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    commentId:[{type: mongoose.Schema.Types.ObjectId, ref: 'CommentPost'}],
    likeId:[{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    createdAt: { type: Date, required: true, default: Date.now},
    isApprove:{ type: Boolean, default: false }
});
var UploadPost=mongoose.model('UploadPost',uploadImageSchema);

module.exports=UploadPost;