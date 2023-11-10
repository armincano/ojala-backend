const express = require("express");
const bcrypt = require("bcrypt"); //hash password before saving it to DB
const authenticate = require("../middleware/authenticate");
const generateJwt = require("../utils/utils.generateJwt");
const router = express.Router();

// user sign-in / login
router.post("/sign-in", async (req, res) => {
	let client;
	const { email, password } = req.body;

	try {
		client = await req.pool.connect();
		const query = `SELECT * FROM "admin" WHERE email=$1;`;
		const { rows } = await client.query(query, [email]);

		if (rows.length === 0) {
			return res
				.status(401)
				.json({ error: "Invalid Credential", isAuthenticated: false });
		}

		/* if the user exist, compare the password provided by user
    with the hashed password we stored during user registration
		*/
		const isValidPassword = await bcrypt.compare(password, rows[0].password);
		if (!isValidPassword) {
			return res
				.status(401)
				.json({ error: "Invalid Credential", isAuthenticated: false });
		}

		/* if the password matches with hashed password
    then generate a new token and send it back to user
    */
		const jwtToken = generateJwt(rows[0].id);
		return res.status(200).send({ jwtToken, isAuthenticated: true });
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ error: error.message });
	} finally {
	if (client) {
		client.release();
	}
}
});

// user authorization
router.post("/auth", authenticate, (req, res) => {
	/* 	'authenticate' is a custom we will use
	in all the endpoints which we want to protect
	to verify user identity before sending back the requested resources.
 */
	try {
		res.status(200).send({ isAuthenticated: true });
	} catch (error) {
		console.error(error.message);
		res.status(500).send({ error: error.message, isAuthenticated: false });
	}
});

module.exports = router; 