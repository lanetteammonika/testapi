var mongoose=require('mongoose');
var Users = require('./model');

var imageSchema = new mongoose.Schema({
    image:String,
    title:String,
    description:String,
    userId:{type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    friendId:String,
    like:Number,
    comment:String,
    isApprove:{ type: Boolean, default: false }
});
var Images=mongoose.model('Images',imageSchema);

module.exports=Images;