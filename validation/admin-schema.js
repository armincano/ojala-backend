const {body} = require("express-validator");

const adminPostSchema = [
    body("email").exists({values: "falsy"}).isString().escape(),
    body("password").exists({values: "falsy"}).isString().escape(),
];

module.exports = {
    contactPostSchema: adminPostSchema
};