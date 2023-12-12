# ¡Ojalá! webapp

Welcome to the "Ojalá" backend repo that contains its code and resources.
The project is a Single Page Application built with React, a Bootstrap custom UI, Express.js and PostgreSQL.
Serves as the online presence for the “¡Ojalá!” phone app.

We welcome contributions from the community. Whether it's fixing a bug, improving the user interface, or adding new features, you can help shape the future of "Ojalá." Please refer to our Contributing Guidelines for more details.

## About Ojalá

"Ojalá" is a free phone app to learn Spanish that fits the language needs of people on the move on arrival in Spain. Includes minority languages like Wolof and Darija.

## Visit the deployed webapp

Click the link 👉[Ojala](https://ojala.migracode.org/).

## Getting Started

### Prerequisites

Before you begin, ensure you have met the following requirements:

- A code editor of your choice (e.g., Visual Studio Code).
- [Node.js](https://nodejs.org/) installed on your local machine.
  > [!IMPORTANT]  
  > Node.js Version 20.6.0 or higher is required.
- PostgreSQL installed. If you are using Mac, we recommend you the full-featured PostgreSQL installation package "Postgres.app".

### Installation

1. Open your favourite terminal app and clone this repository:

   ```bash
   git clone https://github.com/armincano/ojala-backend.git
   ```

2. Navigate to the root directory of the local cloned repo.

3. Install project dependencies:
   ```bash
   npm install
   ```
4. With your PostgreSQL server running, run the SQL script `ojala-db-v2`, located in the "misc" folder of the repo, to create a database to work during development. We recommend you to run the SQL script using DBeaver or pgAdmin 4 as your SQL client.
5. Create an `.env` file in the root directory. Add the following values to the `.env` file:

```env
CORS_ORIGIN=http://localhost:3000
PORT=3001
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=ojala
PG_USER=postgres
PG_PASSWORD=postgres
JWT_SECRET=test-secret
COOKIE_OPTION_SECURE=false
```

### Usage

- To start the development server, run the following command from the root directory:

```bash
 npm run dev
```

## Contributing Guidelines

If you'd like to contribute to the development of the Ojalá backend, please follow these guidelines:

- Fork this repository.
- Checkout to `main` branch.
- Create a new branch for your feature or bug fix: `git checkout -b feat/feat-name`. Replace `feat-name` with yours.
- Make your changes.
- Test your changes to ensure they work as expected.
- Commit your changes: `git commit -m "Add feat/fix"`
- Push your branch: `git push origin feat/feat-name`
- Create a Pull Request to the `main` branch of this repository.

## License:

This project is ?????????

## Contact:

For any inquiries or feedback, feel free to reach out to us at ?????????.
