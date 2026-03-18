# @consultancy/api

## Running the API locally

To run the API locally, you can use the following command:

```bash
npm run dev
```

This will start the API server on `http://localhost:5173/`. You can then make requests to the API endpoints using tools like Postman or curl.

```curl
curl http://localhost:5173/api/endpoint
```

## Env

### Secret Generation

To generate a secret for Better Auth, you can use the following command in your terminal:

`npx auth secret`
This will output a secure, random string that you can use as the `BETTER_AUTH_SECRET` in your `.env` file. Make sure to keep this secret safe and do not share it publicly, as it is used to sign authentication tokens.
