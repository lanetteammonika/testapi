var mongoose=require('mongoose');

var tokenSchema = new mongoose.Schema({
    _userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    token: { type: String, required: true},
    createdAt: { type: Date, required: true, default: Date.now},
});
//tokenSchema.index( { "createdAt": 1 }, { expires: '15' } )
//db.tokenSchema.createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3600 } )

//tokenSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 5 });

module.exports=mongoose.model('Temps',tokenSchema);
