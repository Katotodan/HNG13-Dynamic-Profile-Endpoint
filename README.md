# Dynamic Profile Endpoint (backend)

Minimal Node.js backend for the HNG13 dynamic profile endpoint project. 
This is part of my HNG13 internship backend project.

## Task description

Build a simple RESTful API endpoint that returns your profile information along with a dynamic cat fact fetched from an external API. This task validates your ability to consume third-party APIs, format JSON responses, and return 

Task — Profile Endpoint (core requirements)
Required endpoint
Create a GET endpoint at: /me
The endpoint must return JSON data with Content-Type: application/json
Must integrate with the Cat Facts API to fetch dynamic cat facts
Response structure (required fields)
Your endpoint must return a JSON response in this exact format:
```
{
  "status": "success",
  "user": {
    "email": "<your email>",
    "name": "<your full name>",
    "stack": "<your backend stack>"
  },
  "timestamp": "<current UTC time in ISO 8601 format>",
  "fact": "<random cat fact from Cat Facts API>"
}
```

## Prerequisites

- Node.js 18+ (recommended). This project uses the global `fetch` API; if you run Node <18 you'll need a fetch polyfill or to upgrade Node.
- npm (or yarn)

## Install

Install dependencies:

```bash
npm install
```

## Run

```bash
npm start
```
or

```bash
node index.js
```


## Server details

- Default port: 3000 (see `index.js`).
- CORS is enabled for all origins.
- Request timeout: the server uses `connect-timeout` set to 5s; some routes intentionally delay longer and will result in a 504 timeout.

### Endpoints

- `GET /` — returns a plain `Hello World!` message. Note: the implementation delays 6s which exceeds the 5s timeout and will usually return a timeout error. This was set just to test the timeout functionality

- `GET /me` — returns a JSON object with a small `user` object, current timestamp and a `fact` field fetched from `https://catfact.ninja/fact`.

Example `GET /me` response shape:

```json
{
	"status": "success",
	"user": { "email": "emailexample@gmail.com", "name": "Your fullname", "stack": "Node.js/Express" },
	"timestamp": "2025-10-16T...", // Current time
	"fact": "A short cat fact..." // A random cat fact
}
```

## Troubleshooting

- If you see an error like `fetch is not defined`, upgrade to Node 18+ or install a fetch polyfill (for example `node-fetch`) and require it at the top of `index.js`:

```js
// For Node <18 (not recommended):
// npm install node-fetch@2
// const fetch = require('node-fetch');
```

- If the root route appears to timeout, it's intentional in the current implementation (6s delay vs 5s server timeout).

## Environment variables

This project can read configuration from a `.env` file using the popular `dotenv` package. A `.env` file lets you override the default port and external API URL without changing source code.

Create a `.env` file in the project root with values like:

```
FULLNAME=Your full name
EMAIL_ADDRESS=Your email address
STACK=Your stack
```

To enable `.env` support, install `dotenv` (if not already installed):

```bash
npm install dotenv
```

Then load it at the top of `index.js` before accessing `process.env`:

```js
require('dotenv').config();
```


## Files

- `index.js` — application entry point (Express server).
- `package.json` — project metadata and dependencies.



## Contributing

Simple changes welcome. If you add or change dependencies run `npm install` and consider adding a `start` script to `package.json`.

## License

The project lists `MIT` in `package.json`. Add a `LICENSE` file if you want to make the terms explicit.
