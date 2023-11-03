const express = require("express");
const { matchedData } = require("express-validator");
const app = express();
const cors = require("cors");
const port = 3001;
const { Pool } = require("pg");
const validationSchema = require("./schema/validation-schema");
const validateSchema = require("./middleware/validate-schema");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const pool = new Pool({
	user: "postgres",
	password: "postgres",
	host: "localhost",
	port: 5432,
	database: "ojala",
});

app.use((err, req, res, next) => {
	if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
		// Handle JSON parsing error here
		return res.status(400).json({ error: "Invalid JSON" });
	}
	next();
});

app.get("/", (req, res) => {
	res.send("Hello World!");
});

//getting all inquiries
app.get("/contact", async (req, res) => {
	let client;
	try {
		client = await pool.connect();

		const query = `SELECT v.id, v.first_name, v.last_name, v.email, vu.issue
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
app.get(
	"/contact/:id",
	validationSchema.visitorGetSchema,
	validateSchema.validateSchema,
	async (req, res) => {
		const data = matchedData(req);
		let client;
		try {
			client = await pool.connect();

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
	}
);

//sending an inquiry
app.post(
	"/contact",
	validationSchema.visitorPostSchema,
	validateSchema.validateSchema,
	async (req, res) => {
		const data = matchedData(req);
		let client;
		let id;

		try {
			client = await pool.connect();
			const query = `SELECT * FROM visitor WHERE email=$1;`;
			const { rows } = await client.query(query, [data.email]);
			id = rows[0]?.id;

			await client.query("BEGIN");

			if (rows.length > 0) {
				const query = `INSERT INTO visitor_issue (visitor_id, issue)
                VALUES($1, $2)
				RETURNING id;`;

				await client.query(query, [id, data.issue]);

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

				const query2 = `INSERT INTO visitor_issue (visitor_id, issue)
				VALUES($1, $2)
				RETURNING id, visitor_id, issue;`;

				await client.query(query2, [rows[0].id, data.issue]);

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
	}
);

app.listen(port, function () {
	console.log(`Ojala Server listening on port ${port}`);
});
