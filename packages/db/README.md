# Running a Postgres Database in Docker

This guide explains how to set up a PostgreSQL database using Docker, which is useful for local development and testing.

## Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/) installed on your machine

## 1. Pull the Postgres Docker Image

Open your terminal and run:

```
docker pull postgres
```

## 2. Start a Postgres Container

Run the following command to start a new Postgres container:

```
docker run --name drizzle-postgres -e POSTGRES_PASSWORD=mypassword -e POSTGRES_USER=admin -d -p 5432:5432 postgres
```

- `--name drizzle-postgres`: Names your container for easy reference
- `-e POSTGRES_PASSWORD=mypassword`: Sets the database password
- `-e POSTGRES_USER=admin`: Sets the database user
- `-d`: Runs the container in detached mode
- `-p 5432:5432`: Maps port 5432 on your machine to the container

## 3. Create a Database

By default, only the `postgres` database is created. To create a new database (e.g., `mydatabase`), run:

```
docker exec -it drizzle-postgres psql -U admin -c "CREATE DATABASE mydatabase;"
```

## 4. Connect to the Database

You can now connect to your database using a Postgres client or from your application using the following connection string:

```
postgresql://admin:mypassword@localhost:5432/mydatabase
```

## 5. Stopping and Removing the Container

To stop the container:

```
docker stop drizzle-postgres
```

To remove the container:

```
docker rm drizzle-postgres
```

To start the container again after stopping:

```
docker start drizzle-postgres
```

---

For more details, see the [official Postgres Docker documentation](https://hub.docker.com/_/postgres).
