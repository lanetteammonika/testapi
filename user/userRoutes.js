
var express=require('express');
var app=express();
var controller=require('./controller');

app.post('/confirmation', controller.signUp);
app.get('/verifylink/:token', controller.confirmationPost);
app.post('/login', controller.loginPost);
app.post('/uploadpost/:id',controller.uploadPost);
app.post('/uploadprofile/:id',controller.uploadProfile);
app.get('/getpost',controller.getPost);
app.post('/updatepost/:imgid',controller.updatePost);
app.post('/forgetpassword/:email',controller.forgetpassword);
app.delete('/removetoken/:token',controller.removetoken);
app.get('/gettokenrecord/:token',controller.gettokenrecord);
app.get('/getalluser',controller.getalluser);
app.post('/finduser/:email',controller.finduser);
app.post('/changepassword',controller.changepassword);
app.get('/getAllPost',controller.getAllPost);
app.post('/userpost/:id',controller.userpost);
app.post('/commentpost',controller.commentpost);
app.post('/getuser/:id',controller.getuser);
app.get('/getusercomment',controller.getAllComment);
app.post('/likepost',controller.likepost);
app.post('/makeverifiedcomment/:id',controller.makeverified);
app.post('/sendmail/:email',controller.sendemail);
app.post('/sendbirthday/:id',controller.uploadBirthdate);







module.exports=app;