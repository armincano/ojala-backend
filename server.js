const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { Pool } = require("pg");
const { checkPoolConnection } = require("./utils/utils.pool")
const { handleNoMatchPath } = require("./middleware/handle-no-match-path");
const {
	handleErrorInvalidJson,
} = require("./middleware/handle-error-invalid-json");
const contact = require("./routes/contact")
const admin = require("./routes/admin")

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(handleErrorInvalidJson);

app.use(
	cors({
		origin: ["http://localhost:3000"],
	})
);

const pool = new Pool({
	host: process.env.PG_HOST,
	port: process.env.PG_PORT,
	database: process.env.PG_DATABASE,
	user: process.env.PG_USER,
	password: process.env.PG_PASSWORD,
});

checkPoolConnection(pool)

// attaches the pool object to the req object as req.pool.
app.use((req, res, next) => {
	req.pool = pool;
	next();
  });
  

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.use("/contact", contact)

app.use("/admin", admin)

app.use(handleNoMatchPath);

app.listen(process.env.PORT || 3001, function () {
	console.log(`Ojala Server listening on port ${process.env.PORT}`);
});
