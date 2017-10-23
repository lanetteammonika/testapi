'use strict'

var mongoose=require('mongoose');
// var randtoken = require('rand-token');
// var token=randtoken.generate(32);
var userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role:String,
    image: String,
    token: String,
    isVerified: { type: Boolean, default: false },
    date:String
});
//var tempSchema = new mongoose.Schema({
 //   email: { type: String },
   // token: String,
//});

var Users=mongoose.model('User',userSchema);
//var Temp=mongoose.model('Temp',tempSchema);
module.exports=Users;
//module.exports=Temp;