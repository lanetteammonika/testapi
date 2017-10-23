//import model from './model';
var Users = require('./model');
var Temps = require('./tempModel');
var Images = require('./imageModel');
var randtoken = require('rand-token');
var nodemailer = require('nodemailer');
var CommentPost = require('./commentPost');
var LikePost = require('./LikePost');
var UploadPost = require('./uploadPost');
var multer = require('multer');
var _ = require('lodash');

exports.removetoken = function (req,res) {
    debugger

        Temps.remove({token:req.params.token},function (err2) {
            if(err2){
                return  res.send('err----',err2);
            }
            res.send('store');

        })


    }

exports.signUp = function (req, res) {

    // console.log('--->call<------', req.body);
    var user = req.body;
    const newUser = new Users(user);
    // Generate a 32 character alpha-numeric token:
    var token = randtoken.generate(32);

    newUser.image = '';
    newUser.token = token;

    console.log(newUser);
    Users.findOne({email:req.body.email},function (err,result) {
        if(err){
            return res.send(err)
        }
        console.log('result----------',result);

        if(result === null){
            newUser.save(function (err,result) {
                debugger
                if (err) {
                    return res.send({msg: err});
                }else {
                    console.log('-------',result)
                    // Create a verification token for this user
                    var token = new Temps();
                    token._userId=result._id;
                    token.token= result.token;
                    console.log('saved=-----', token._userId);
                    // Save the verification token
                    token.save(function (err) {
                        debugger
                        if (err) {
                            return res.send({msg:err});
                        }
                        //console.log('saved=-----', token)

                        // Send the email
                        var transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: 'lanetteam.monikaa@gmail.com',
                                pass: 'lanetteam1'
                            }
                        });
                        const verifyLink = 'http://localhost:4000/verifylink/' + newUser.token;
                        var mailOptions = {
                            from: 'lanetteam.monikaa@gmail.com',
                            to: newUser.email,
                            subject: 'Sending Email using Node.js',
                            text: verifyLink
                        };

                        transporter.sendMail(mailOptions, function (error, info) {
                            console.log(mailOptions)
                            if (error) {
                                console.log(error);
                                res.send({msg: 'error'})

                            } else {
                                res.send({msg: "",user:newUser})
                                console.log('Email sent: ' + info.response);
                            }
                        });

                    });
                }
            });
           // res.send('if part')

        }else{
            res.send({msg:'already exist'})
        }
        //console.log('result----------',result);
    })

    // newUser.save(function (err,result) {
    //     debugger
    //     if (err) {
    //         return res.send({msg: err});
    //     }else {
    //         console.log('-------',result)
    //         // Create a verification token for this user
    //         var token = new Temps();
    //         token._userId=result._id;
    //         token.token= result.token;
    //          console.log('saved=-----', token._userId);
    //         // Save the verification token
    //         token.save(function (err) {
    //             debugger
    //             if (err) {
    //                 return res.send({msg:err});
    //             }
    //             //console.log('saved=-----', token)
    //
    //             // Send the email
    //             var transporter = nodemailer.createTransport({
    //                 service: 'gmail',
    //                 auth: {
    //                     user: 'lanetteam.monikaa@gmail.com',
    //                     pass: 'lanetteam1'
    //                 }
    //             });
    //             const verifyLink = 'http://localhost:4000/verifylink/' + newUser.token;
    //             var mailOptions = {
    //                 from: 'lanetteam.monikaa@gmail.com',
    //                 to: newUser.email,
    //                 subject: 'Sending Email using Node.js',
    //                 text: verifyLink
    //             };
    //
    //             transporter.sendMail(mailOptions, function (error, info) {
    //                 console.log(mailOptions)
    //                 if (error) {
    //                     console.log(error);
    //                     res.send({msg: 'error'})
    //
    //                 } else {
    //                     res.send({msg: newUser})
    //                     console.log('Email sent: ' + info.response);
    //                 }
    //             });
    //
    //         });
    //     }
    // });

//Today's Work:-=>create api for registration with email varification using token in node js

}

exports.confirmationPost = function (req, res) {
    // console.log(req.params)

    // Find a matching token
    Temps.find(req.params, function (err, temp) {
        /// console.log('token---',temp)
        if (err) {
            console.log(err)
        } else {
            // console.log('token---',temp)

            if (!temp) return res.send({msg: 'We were unable to find a valid token. Your token my have expired.'});

            // If we found a token, find a matching user
            Users.find({_id: temp[0]._userId}, function (err, user) {
                //console.log('user---',user)

                if (!user) return res.send({msg: 'We were unable to find a user for this token.'});
                if (user[0].isVerified) return res.send({msg: 'This user has already been verified.'});

                // Verify and save the user
                user[0].isVerified = true;
                user[0].save(function (err) {
                    if (err) {
                        return res.send({msg: err.message});
                    }
                    res.send({msg:"The account has been verified. Please log in."});
                });
            });
        }
    });
};

exports.loginPost = function (req, res) {

    Users.findOne({email: req.body.email}, function (err, user) {
        //console.log('user---', req.body.password)
        if (!user) return res.send({msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});
        //const newUser = new Users(user);
        ///console.log('user---', newUser)
        // const pass=user.email
        if (user.password == req.body.password) {
            if (!user.isVerified) return res.send({
                type: 'not-verified',
                msg: 'Your account has not been verified.'
            });

            // Login successful, write token, and send back user
            user.token = randtoken.generate(32);
            user.save(function (err,result) {
                if (err) {
                    return res.send({msg: err.message});
                }
                console.log("Successfull log in.");
                var token = new Temps();
                token._userId=result._id;
                token.token= result.token;
                console.log('saved=-----', token._userId);

                // Save the verification token
                Temps.updateOne({_userId:result._id},{token:result.token},function (err,result5) {
                    debugger
                    if (err) {
                        return res.send({msg: err});
                    }
                    console.log('token obj---------',result5);
                });
                console.log('user obj---------',result);

                res.send({user: user.toJSON(),msg:""});
            });

            // res.send({token: randtoken.generate(32), user: user.toJSON()});
        }
        else {
            return res.send({msg: 'Invalid email or password'})
        }
        // user.comparePassword(req.body.password, function (err, isMatch) {
        //     if (!isMatch) return res.send({msg: 'Invalid email or password'});
        //
        //     // Make sure the user has been verified
        //     if (!user.isVerified) return res.send({
        //         type: 'not-verified',
        //         msg: 'Your account has not been verified.'
        //     });
        //
        //     // Login successful, write token, and send back user
        //     res.send({token: generateToken(user), user: user.toJSON()});
        // });
    })
};

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        //console.log(file)
        var filename = req.params.id + '.' + file.mimetype.split('/')[1];
        //console.log(filename)
        console.log('filename----',filename.split('-')[0])

        callback(null,file.originalname+'-'+filename);
        //console.log(filename.split('-')[1])


    }
});
// callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
var upload = multer({storage: storage}).single("userPhoto");

exports.uploadBirthdate = function (req, res) {
    //console.log('img----',req.file)


        Users.updateOne({_id: req.params.id}, {date:req.body.date}, {
            upsert: true,
            returnNewDocument: true
        }, function (err) {
            if (err) {
                return res.end("Error while update image in database");
            }

                    return res.send({msg:'Success'});

        })

        // res.end("File is uploaded");

}

exports.uploadProfile = function (req, res) {
    //console.log('img----',req.file)
    upload(req, res, function (err, data) {
        if (err) {
            return res.end("Error uploading file.");
        }
        const url=req.file.path.split('/')[1]
        console.log('img----',url)

        Users.updateOne({_id: req.params.id}, {image: 'http://localhost:4000/uploads/'+url}, {
            upsert: true,
            returnNewDocument: true
        }, function (err) {
            if (err) {
                return res.end("Error while update image in database");
            }

            return res.send({msg:'Success'});

        })

        // res.end("File is uploaded");
    });
}

exports.uploadPost = function (req, res) {
    //console.log('img----',res)
    upload(req, res, function (err, data) {
        if (err) {
            return res.end("Error uploading file.");
        }

                debugger

                const newImage = new Images();
                newImage.image = 'http://localhost:4000/uploads/'+ req.file.path.split('/')[1];
                newImage.title = req.body.title;
                newImage.description=req.body.description;
                newImage.userId = req.params.id;
                newImage.friendId = '';
                newImage.like = 0;
                newImage.comment = '';
                newImage.save(function (err) {
                    if (err) {
                        return res.end("Error while save image in database");
                    }
                    return res.send({msg:'Success'});
                })


        // res.end("File is uploaded");
    });
}

exports.gettokenrecord = function (req, response) {
    Temps.findOne({token:req.params.token},function (err,res) {
        if(err){
            return res.send('errrr-----',err);
        }
        response.send(res);
    })
}

exports.getPost = function (req, res) {
    const imgFolder = __dirname + '/../uploads/';
    debugger
    console.log('---->call<-----', imgFolder)
    const fs = require('fs');
    fs.readdir(imgFolder, function (err, files) {
        if (err) {
            return console.log(err);
        }
        const filesArr = [];
        var i = 1;

        files.forEach(function (file) {
            filesArr.push({image: 'http://localhost:4000/uploads/'+ file});
            i++;
        })
        res.json(filesArr);
    })
}

exports.updatePost = function (req, res) {

    Images.findOne({_id: req.params.imgid}, function (err, image) {
        var user = req.body;

       //console.log(user);
        if (err) {
            //res.send(err);
            return console.log(err);
        }

        image.like=image.like+req.body.like || image.like+0;
        image.userId=req.body.userId || image.userId;
        image.friendId=req.body.friendId || 1;
        image.comment=req.body.comment;
        image.save(function (err) {
            if (err) {
                return res.end("Error while save image in database");
            }
            return res.send(image);
        })
        console.log(image);
    })
}

exports.forgetpassword = function (req,res) {
    var email=req.params.email;
    Users.findOne({email:email},function (err,result) {
        if (err) {
            return res.send(err)
        }
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lanetteam.monikaa@gmail.com',
                pass: 'lanetteam1'
            }
        });
        console.log(result);
        const verifyLink = 'http://localhost:8080/changepassword/' + result.token;
        var mailOptions = {
            from: 'lanetteam.monikaa@gmail.com',
            to: result.email,
            subject: 'Sending Email using Node.js',
            text: verifyLink
        };

        transporter.sendMail(mailOptions, function (error, info) {
            console.log(mailOptions)
            if (error) {
                console.log(error);
               return res.send({msg: 'error'})

            }
                res.send({msg: ""})
                console.log('Email sent: ' + info.response);

        });
    });

}

exports.getalluser= function (req,res) {
    Users.find({},function (err,result) {
        if(err){
            return res.send({msg:err});
        }
        res.send({user:result});

    })
}

exports.finduser= function (req,res) {
    Users.findOne({email:req.params.email},function (err,result) {
        if(err){
            return res.send({msg:err});
        }
        res.send({user:result});

    })
}

exports.changepassword= function (req,res) {
    Users.findOne({token:req.body.token},function (err,result) {
        if(err){
            return res.send({msg:err});
        }
        console.log({user:result});
        const newUser=new Users(result);
        newUser.password=req.body.password;
        Users.findByIdAndUpdate({_id: newUser._id},{password: req.body.password} ,{
            upsert: true,
            returnNewDocument: true
        }, function (err) {
            debugger
            if (err) {
                return res.send({msg: err});
            }
            console.log({user:result});
            res.send({user:result});

        });
        console.log({user:result});

    })
}

exports.getAllPost = function (req,res) {
    debugger
    UploadPost.find()
        .populate('userId')
        .populate('commentId')
        .populate('likeId')
        .populate({
            path: 'commentId',
            model: 'CommentPost',
            populate: {
                path: 'userId',
                model: 'User'
            }
        })
        .populate({
            path: 'commentId',
            model: 'CommentPost',
            populate: {
                path: 'frdId',
                model: 'User'
            }
        })
        .exec(function (err, result) {
            console.log(err)
            if(err){
                return res.send({msg:err});
            }
            res.send({posts:result});
})
}

exports.getuser = function (req,res) {
    Users.find({_id: req.params.id},function (err,result) {
        if(err){
            return res.send({msg:err});
        }
        res.send({user:result});


    })
}

exports.userpost = function (req,res) {
    upload(req, res, function (err, data) {
        if (err) {
            return res.end("Error uploading file.");
        }
        const uploadpost = new UploadPost();
        uploadpost.image = 'http://localhost:4000/uploads/'+ req.file.path.split('/')[1];
        uploadpost.title = req.body.title;
        uploadpost.description=req.body.description;
        uploadpost.userId = req.params.id;

        uploadpost.save(function (err) {
            if (err) {
                return res.end("Error while save image in database");
            }
            return res.send({msg:'Success'});
        })


    })
}

exports.commentpost = function (req,res) {

    upload(req, res, function (err, data) {
        debugger
        if (err) {
            return res.end("Error uploading file.");
        }
        const uploadpost = new CommentPost();
        uploadpost.postId=req.body.postId;
        uploadpost.userId = req.body.userId;
        uploadpost.frdId = req.body.frdId;
        uploadpost.comment = req.body.comment;
        console.log('comment obj---',uploadpost)
        uploadpost.save(function (err) {
            if (err) {
                return res.end("Error while save image in database");
            }

                UploadPost.findOne({_id:req.body.postId},function (err,resultpost) {
                debugger
                    if(err){
                         res.send({msg:err});
                    }
                    UploadPost.updateOne(
                        { _id: req.body.postId },
                        { $push: { commentId: uploadpost._id } }, {
                            upsert: true,
                            returnNewDocument: true
                        }, function (err) {
                            debugger
                            if (err) {
                                 res.end("Error while update image in database");
                            }

                          // res.end({msg:'Success'});

                        })
                    //return res.send({msg:'Success'});
                })

            return res.send({msg:'Success'});
        })


    })
}

exports.getAllComment = function (req,res) {
    CommentPost.find().populate('postId').populate('userId').populate('frdId').exec(function (err, result) {
        if(err){
            return res.send({msg:err});
        }
        res.send({comments:result});
    })
}

exports.likepost = function (req,res) {
    var like = false;



        UploadPost.findOne({_id:req.body.postId},function (err,resultpost) {
            debugger
            if(err){
                res.send({msg:err});
            }
            console.log('---likeid---', resultpost.likeId)
           let _ = resultpost.likeId.map(function (id, index) {
                debugger
                const newId = id.toString()
                if(newId === req.body.frdId){
                    like=true;
                    return true
                }
            });

            if(!like){
                debugger
                UploadPost.updateOne(
                    { _id: req.body.postId },
                    { $push: { likeId: req.body.frdId } }, {
                        upsert: true,
                        returnNewDocument: true
                    }, function (err) {
                        debugger
                        if (err) {
                            res.end("Error while update image in database");
                        }
                        return res.send({msg:'likeadded'});
                        // res.end({msg:'Success'});

                    })
               // console.log('not exist')
            }else{
                debugger
                UploadPost.updateOne(
                    { _id: req.body.postId },
                    { $pull: { likeId: req.body.frdId } }, {
                        upsert: true,
                        returnNewDocument: true
                    }, function (err) {
                        debugger
                        if (err) {
                            res.end("Error while update image in database");
                        }
                        return res.send({msg:'likedelete' +
                        ''});
                        // res.end({msg:'Success'});

                    })
               // console.log('exist')
            }

        })
}

exports.makeverified=function (req,res) {
    CommentPost.updateOne({_id: req.params.id}, {isApprove:true}, {
        upsert: true,
        returnNewDocument: true
    }, function (err) {
        if (err) {
            return res.end("Error while update in database");
        }

        return res.send({msg:'Success'});

    })
}

exports.sendemail=function (req,res) {
    const email=req.params.email;
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lanetteam.monikaa@gmail.com',
            pass: 'lanetteam1'
        }
    });

    var mailOptions = {
        from: 'lanetteam.monikaa@gmail.com',
        to: email,
        subject: 'Sending Emai from test demo ',
        text: req.body.text
    };
    transporter.sendMail(mailOptions, function (error, info) {
        console.log(mailOptions)
        if (error) {
            console.log(error);
            res.send({msg: 'error'})

        } else {
            res.send({msg: ""})
            console.log('Email sent: ' + info.response);
        }
    });

}

