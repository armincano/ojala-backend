const jwt = require("jsonwebtoken");
require("dotenv").config(); //dotenv module access environment variables from .env file

function generateJWT(adminId) {
	const payload = {
		user: {
			id: adminId,
		},
	};
	return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
}

module.exports = generateJWT; //we export this function to use it inside routes/user.js
