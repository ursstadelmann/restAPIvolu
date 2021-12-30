/**
This file controls if the permissions are valid.
*/

const jwt = require('jsonwebtoken'),
secret = require('../config/env.config')['jwt_secret'];
const ADMIN_PERMISSION = require('../config/env.config')['permissionLevels']['ADMIN'];

//control if permission level is sufficient
exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.jwt.permissionLevel);
        let userId = req.jwt.userId;
        if (user_permission_level & required_permission_level) {
            return next();
        } else {
            return res.status(403).send();
        }
    };
};

//control if same user or admin
exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let userId = req.jwt.userId;
    if (req.params && req.params.userId && userId === req.params.userId) {
        return next();
    } else {
        if (user_permission_level & ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send();
        }
    }

};

//control if only admin can do that
exports.sameUserCantDoThisAction = (req, res, next) => {
    let userId = req.jwt.userId;
    if (req.params.userId !== userId) {
        return next();
    } else {
        return res.status(400).send();
    }
};

//control if the same company is posting as is donating
exports.onlySameCompany = (req, res, next) => {
    let company = req.jwt.company;
    if (company == req.body.company) {
        return next();
    } else {
        return res.status(400).send();
    }
};
