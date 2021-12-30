/**
This file defines the CRUD-Operations for the /donations-endpoints.
*/

const DonationsController = require('./controllers/donations.controller');
const PermissionMiddleware = require('../common/middlewares/auth.permission.middleware');
const ValidationMiddleware = require('../common/middlewares/auth.validation.middleware');
const config = require('../common/config/env.config');

const ADMIN = config.permissionLevels.ADMIN;
const PAID = config.permissionLevels.PAID_USER;
const FREE = config.permissionLevels.NORMAL_USER;

//exports the /donations functions
exports.routesConfig = function (app) {

    //create a donation, but only for the users company
    app.post('/donations', [
        ValidationMiddleware.validJWTNeeded,
        PermissionMiddleware.onlySameCompany,
        DonationsController.insert
    ]);

     //display all donations for the Admin
     app.get('/donations', [
            ValidationMiddleware.validJWTNeeded,
            PermissionMiddleware.minimumPermissionLevelRequired(PAID),
            DonationsController.list
     ]);

     //display donation by id for the Admin
     app.get('/donations/:donationId', [
             ValidationMiddleware.validJWTNeeded,
             PermissionMiddleware.minimumPermissionLevelRequired(FREE),
             DonationsController.getById
     ]);

     //change donation by id When Admin
     app.patch('/donations/:donationId', [
             ValidationMiddleware.validJWTNeeded,
             PermissionMiddleware.minimumPermissionLevelRequired(FREE),
             PermissionMiddleware.onlySameUserOrAdminCanDoThisAction,
             DonationsController.patchById
     ]);

      //delete a donation by id when Admin
      app.delete('/donations/:donationId', [
             ValidationMiddleware.validJWTNeeded,
             PermissionMiddleware.minimumPermissionLevelRequired(ADMIN),
             DonationsController.removeById
      ]);
};
