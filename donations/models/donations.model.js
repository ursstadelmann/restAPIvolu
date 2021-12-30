/**
This file makes the schema for the donations-data.
*/

//add mongoose and the mongoose Schema
const mongoose = require('../../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

//define what the Schema looks like
const donationSchema = new Schema({
    company: String,
    customerID: String,
    amountDonated: Number,
    date: {
            type: Date,
            default: Date.now,
            },
});

//return the donation with an id
donationSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

//ensure virtual fields are serialised
donationSchema.set('toJSON', {
    virtuals: true
});

//return the donation with the required id
donationSchema.findById = function (cb) {
    return this.model('Donations').find({id: this.id}, cb);
};

//register the schema with mongoose
const Donation = mongoose.model('Donations', donationSchema);

//return a donation by id
exports.findById = (id) => {
    return Donation.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

//create an new donation
exports.createDonation = (donationData) => {
    const donation = new Donation(donationData);
    return donation.save();
};

//return donation list
exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Donation.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, donations) {
                if (err) {
                    reject(err);
                } else {
                    resolve(donations);
                }
            })
    });
};

//update donation
exports.patchDonation = (id, donationData) => {
    return Donation.findOneAndUpdate({
        _id: id
    }, donationData);
};

//remove donation by id
exports.removeById = (donationId) => {
    return new Promise((resolve, reject) => {
        Donation.deleteMany({_id: donationId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};