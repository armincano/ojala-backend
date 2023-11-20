const express = require("express");
const router = express.Router()
const { matchedData } = require("express-validator");
const { validateSchema } = require("../middleware/validate-schema");
const {
	contactGetSchema,
	contactPostSchema,
	contactDeleteSchema
} = require("../validation/contact-schema");
const authorize = require("../middleware/authorize");

//getting all inquiries
router.get("/", authorize, async (req, res) => {
	let client;
	try {
		client = await req.pool.connect();

		const query = `SELECT vu.id, v.first_name, v.last_name, v.email, vu.issue, vu.submit_date
		FROM visitor v
		join visitor_issue vu on v.id = vu.visitor_id
		ORDER BY v.last_name;`;
		const { rows } = await client.query(query);

		return res.status(200).json(rows);
	} catch (error) {
		console.error("Error in /contact route:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (client) {
			client.release();
		}
	}
});

//getting a specific inquiry
router.get("/:id", authorize, contactGetSchema, validateSchema, async (req, res) => {
	const data = matchedData(req);
	let client;
	try {
		client = await req.pool.connect();

		const query = `SELECT * FROM visitor v
			join visitor_issue vu on v.id = vu.visitor_id
			WHERE v.id=$1;`;
		const { rows } = await client.query(query, [data.id]);

		return res.status(200).json(rows);
	} catch (error) {
		console.error("Error in /customers route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (client) {
			client.release();
		}
	}
});

//sending an inquiry
router.post("/", contactPostSchema, validateSchema, async (req, res) => {
	const data = matchedData(req);
	let client;
	let id;
	let submitDate = new Date();

	try {
		client = await req.pool.connect();
		const query = `SELECT * FROM visitor WHERE email=$1;`;
		const { rows } = await client.query(query, [data.email]);
		id = rows[0]?.id;

		await client.query("BEGIN");

		if (rows.length > 0) {
			const query = `INSERT INTO visitor_issue (visitor_id, issue, submit_date)
                VALUES($1, $2, $3)
				RETURNING id;`;

			await client.query(query, [id, data.issue, submitDate]);

			await client.query("COMMIT");
			return res.status(201).send("Issue created for an existing visitor!");
		} else if (!rows.length > 0) {
			const query = `INSERT INTO visitor (first_name, last_name, email, age)
				VALUES($1, $2, $3, $4)
				RETURNING id, first_name, last_name, email, age;`;

			const { rows } = await client.query(query, [
				data.firstName,
				data.lastName,
				data.email,
				data.age,
			]);

			const query2 = `INSERT INTO visitor_issue (visitor_id, issue, submit_date)
                VALUES($1, $2, $3)
				RETURNING id, visitor_id, issue, submit_date;`;

			await client.query(query2, [rows[0].id, data.issue, submitDate]);

			await client.query("COMMIT");
			return res
				.status(201)
				.send("Visitor created!\n" + JSON.stringify(rows[0]));
		} else {
			throw new Error();
		}
	} catch (error) {
		await client.query("ROLLBACK");

		console.error("Error in /contact route:", error);
		return res.status(500).json({ error: "Internal Server Error" });
	} finally {
		if (client) {
			client.release();
		}
	}
});

router.delete("/:visitorIssueId", authorize, contactDeleteSchema, validateSchema, async (req, res) => {
	const data = matchedData(req);
	try {
		client = await req.pool.connect();

		const query = "SELECT * FROM visitor_issue where id=$1;";
		const { rows } = await client.query(query, [data.visitorIssueId]);

		if (!rows.length > 0) {
			throw new Error("visitor-issue-id-doesnt-exist");
		} else {
			const query = `DELETE FROM visitor_issue
			WHERE id = $1;`;

			const { rows } = await client.query(query, [data.visitorIssueId]);
			return res
				.status(200)
				.send(`Visitor issue id ${data.visitorIssueId} was deleted`);
		}
	} catch (error) {
		if (error.message === "visitor-issue-id-doesnt-exist") {
			return res.status(400).send("visitor issue id doesn't exist!");
		} else {
			console.error("Error in contact/ route:", error);
			return res.status(500).json({ error: "Internal Server Error" });
		}
	} finally {
		if (client) {
			client.release();
		}
	}
});

module.exports = router