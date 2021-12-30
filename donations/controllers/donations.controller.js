/**
This file organizes the donations and their credentials.
*/

const DonationModel = require('../models/donations.model');
const crypto = require('crypto');

//create donation, hash password and return the id+201 status
exports.insert = (req, res) => {
    DonationModel.createDonation(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

//send the donations list and 200-status
exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    DonationModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

//return the donation by id + status 200
exports.getById = (req, res) => {
    DonationModel.findById(req.params.donationId)
        .then((result) => {
            res.status(200).send(result);
        });
};


//change only the sent fields for the donation by id and return 204-status
exports.patchById = (req, res) => {
    if (req.body.password) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
        req.body.password = salt + "$" + hash;
    }

    DonationModel.patchDonation(req.params.donationId, req.body)
        .then((result) => {
            res.status(204).send({});
        });

};

//delete a donation and send 204-status
exports.removeById = (req, res) => {
    DonationModel.removeById(req.params.donationId)
        .then((result)=>{
            res.status(204).send({});
        });
};

