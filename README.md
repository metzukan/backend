# Metzukan backend

Based on https://github.com/vmasto/express-babel: Express.js with Babel Boilerplate.

Using TSOA Routing https://github.com/lukeautry/tsoa.

### DB

You could install [Postgres](https://www.postgresql.org/download/) directrly on your computer, or install [Docker](https://www.docker.com/products/docker-desktop) and then use the `docker-compose` to run the container:

```bash
docker-compose up

# shutdown the container
docker-compose down
```

Copy `.env.example` into `.env` and update the variables to match your environment, or define local variable named DATABASE_URL of the form `postgres://user:pass@localhost:5432/metzukan_db`

Install locally:

1. Create Database and User:

   ```bash
   $ psql postgres
   CREATE ROLE metzukan WITH LOGIN PASSWORD 'yourpass';
   ALTER ROLE metzukan CREATEDB;

   $ psql postgres -U metzukan
   CREATE DATABASE metzukan_db;
   GRANT ALL PRIVILEGES ON DATABASE metzukan_db TO metzukan;
   ```
   
2. Run migrations to create tables:

   ```bash
   npm run migrate

   # to revert the last migration
   npm run migrate:revert
   ```

### Run Example

enter in command line:

- `npm i`
- `DATABASE_URL='postgres://user:pass@localhost:5432/metzukan_db'`
- `npm run start`

### API

read [swagger.yaml](./swagger.yaml) file.

### Configuration

environment variables:

- `DATABASE_URL` DB URI.
- `PORT` HTTP Port. (default 8080).
- `REQUESTS_LIMIT` Maximum requests in 10 minutes window per IP. (default 1000).
- `JWT_SECRET` JWT private stamp key.
- `API_KEY` The API key to allows admins to access data.
- `MAIL_USER_NAME` The email account to sent the alerts from  (for example ''my-usename@gmail.com'')
- `MAIL_USER_KEY` The email account password (If you're using the 2-factor authentication protection, generate an application key)
- `MAIL_SMTP_SERVER` The email server (for example 'smtp.gmail.com')
