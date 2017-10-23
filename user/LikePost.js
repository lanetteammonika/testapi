var mongoose=require('mongoose');
var User = require('./model');
var UploadPost = require('./uploadPost');


var likePostSchema = new mongoose.Schema({
    postId:{type: mongoose.Schema.Types.ObjectId, ref: 'UploadPost'},
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    frdId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    comment:String,
    createdAt: { type: Date, required: true, default: Date.now},
    isApprove:{ type: Boolean, default: false }
});
var LikePost=mongoose.model('LikePost',likePostSchema);

module.exports=LikePost;