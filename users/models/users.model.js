/**
This file makes the schema for the user-data.
*/

//add mongoose and the mongoose Schema
const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//define what the Schema looks like
const userSchema = new Schema({
    firstName: String,
    lastName: String,
    company: String,
    email: String,
    password: String,
    permissionLevel: Number
});

//return the user with an id
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//ensure virtual fields are serialised
userSchema.set('toJSON', {
    virtuals: true
});

//return the user with the required id
userSchema.findById = function (cb) {
    return this.model('Users').find({id: this.id}, cb);
};

//register the schema with mongoose
const User = mongoose.model('Users', userSchema);

//return an user by e-mail
exports.findByEmail = (email) => {
    return User.find({email: email});
};

//return the company of an user by id
exports.findCompanyById = (id) => {
    return User.findById(id).company;
}

//return an user by id
exports.findById = (id) => {
    return User.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

//create an new user
exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

//return user list
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        User.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, users) {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
    });
};

//update user
exports.patchUser = (id, userData) => {
    return User.findOneAndUpdate({
        _id: id
    }, userData);
};

//remove user by id
exports.removeById = (userId) => {
    return new Promise((resolve, reject) => {
        User.deleteMany({_id: userId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};
