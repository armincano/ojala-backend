const {validationResult} = require("express-validator");

function validateSchema(req, res, next) {
    const errors = validationResult(req);

	if(!errors.isEmpty()){
		return res.send({ errors: errors.array() });
	}
    next()
}
exports.validateSchema = validateSchema;