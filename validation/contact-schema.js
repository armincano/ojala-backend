const {param, query, body, check} = require("express-validator");

const contactGetSchema = [
    param("id").exists({values: "falsy"}).isInt({min: 0}).escape(),
];

const contactPostSchema = [
    body("firstName").exists({values: "falsy"}).isString().isLength({min: 2}).withMessage("The minimum length for firstName is 2").escape(),
    body("lastName").exists({values: "falsy"}).isString().isLength({min: 2}).withMessage("The minimum length for firstName is 2").escape(),
    body("age").exists({values: "falsy"}).isInt({min: 18}).withMessage("The minimum age is the integer 18").escape(),
    body("email").isEmail().withMessage("Not a valid email address.").escape(),
    body("issue").matches(/app-install|app-mistake|other/).escape(),
];

const contactDeleteSchema = [
    param("visitorIssueId").exists({values: "falsy"}).isInt({min: 1}).withMessage("Issues start from id 1").escape(),
];

module.exports = {
	contactGetSchema,
    contactPostSchema,
    contactDeleteSchema
};