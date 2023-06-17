# Invotastic (ExpressJS) -- A single-tenant demo app

"Invotastic" is a single-tenant demo app that serves individual users as its customers. This repo utilizes a "Backend Server" OAuth2 client type. The backend server technology here is NodeJS along with the ExpressJS web application framework. NodeJS hosts and serves up a React single-page application to the browser upon request.
<br>
<br>

> **Disclaimer:**
> Invotastic is not a real-world application and cannot be used neither to send invoices to real people nor make or receive any monetary payments.

<br>
<hr />

## Demo App Overview

Below is a quick overview of how Invotastic looks behind the scenes and how it interacts with Wristband.

### Entity Model

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-expressjs-demo-app-entity-model-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-expressjs-demo-app-entity-model-light.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-expressjs-demo-app-entity-model-light.png">
</picture>

The entity model starts at the top with an application that encapsulates everything related to Invotastic.  The application has the Wristband identity provider enabled by default so that all users can login with an email and a password.  The application has one OAuth2 client through which users will be authenticated.  In this case, the client is a NodeJS server with Express.

Users that signup with Invotastic will be provisioned to the lone default tenant under the application. When a new user signs up, they are assigned the "End User" role by default, which gives them the necessary access to interact with Wristband.  All users have full access to the entire application.

### Architecture

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-expressjs-demo-app-architecture-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-expressjs-demo-app-architecture-light.png">
  <img alt="entity model" src="https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-expressjs-demo-app-entity-model-light.png">
</picture>

The Invotastic application in this repository utilizes the [Backend for Frontend (BFF) pattern](https://samnewman.io/patterns/architectural/bff/).  The NodeJS server with Express is the backend for the React single-page app frontend. The server is responsible for:

- Storing the client ID and secret.
- Handling the OAuth2 authorization code flow redirections to and from Wristband during user login.
- Creating the application session cookie to be sent back to the browser upon successful login.  The application session cookie contains the access and refresh tokens as well as some basic user info.
- Refreshing the access token if the access token is expired.
- Orchestrating all API calls from the React frontend to both Wristband and the Invotastic backend data store.
- Destroying the application session cookie and revoking the refresh token when a user logs out.

API calls made from React to NodeJS pass along the application session cookie and a [CSRF token](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie) with every request.  The server has three middlewares for all protected routes responsbile for:

- Validating and refreshing the access token (if necessary)
- "Touching" the application session cookie
- Validating the CSRF token

It is important to note that Wristband hosts all onboarding workflow pages (signup, login, etc), and the NodeJS server will redirect to Wristband in order to show users those pages.

### Wristband Code Touchpoints

Within the demo app code base, you can search in your IDE of choice for the text `WRISTBAND_TOUCHPOINT`.  This will show the various places in both the React frontend code and NodeJS backend code where Wristband is involved.  You will find the search results return one of a few possible comments using that search text:

- `/* WRISTBAND_TOUCHPOINT - AUTHENTICATION */` - Code that deals with an authenticated user's application session.  This includes managing their application session cookie and JWTs, OAuth2-related endpoints for login/callback/logout, NodeJS middleware for validating/refreshing tokens, and React context used to check if the user is authenticated.
- `/* WRISTBAND_TOUCHPOINT - RESOURCE API */` - Code that interacts with any Wristband-specific resource APIs or workflow APIs that are not related to authentication or authorization directly.  For example, it could be an API call to update the user's profile or change their password.

There are also some visual cues in the Invotastic UI that indicate if certain forms or buttons will trigger the execution of code that runs through any of the touchpoint categories above. For example, if we look at the Profile Settings UI:
<br>
<br>

![touchpoint](https://assets.wristband.dev/docs/b2c-expressjs-demo-app/b2c-demo-app-update-profile-touchpoint.png)

Submitting the form to update your profile will ultimately trigger a call to the Wristband Update User API, and thus would execute code in the category of `WRISTBAND_TOUCHPOINT - RESOURCE API`.

<br>
<hr />

## Getting Started

You can start up the Invotastic demo application in a few simple steps.

### Sign up for an Wristband account.

First thing is first: make sure you sign up for an Wristband account at [https://wristband.dev](https://wristband.dev).

### Provision the B2C ExpressJS demo application in the Wristband Dashboard.

After your Wristband account is set up, log in to the Wristband dashboard.  Once you land on the home page of the dashboard, click the button labelled "Add Demo App".  Make sure you choose the following options:

- Step 1: App Type - B2C
- Step 2: Client Framework - Express
- Step 3: Domain Format  - Choosing `Localhost` is fastest to setup. You can alternatively choose `Vanity Domain` if you want a production-like experience on your local machine for app-specific vanity domains, but this method will require additional setup.

### Apply your Wristband configuration values to the NodeJS server configuration

Upon completing the demo application setup, you will be prompted with values that you should copy into the environment variable configuration for this demo repository, which is located in `server/.env`.  Replace the following values:

- `APPLICATION_DOMAIN`
- `DOMAIN_FORMAT`
- `CLIENT_ID`
- `CLIENT_SECRET`

### Run the application in "production" mode 

Make sure you are in the root directory of this repository. 

#### Install dependencies

Now install all dependencies for both the React client application and the NodeJS server:

```npm run install-all```

#### Build the client application bundle

Next, build the React asset bundle that will be served up by NodeJS (asset bundle target location is `server/dist/`):

```npm run build```

#### Run the NodeJS server

Start up the NodeJS server in "production" mode. This lets NodeJS serve the React bundle as static content from the NodeJS server.  The NodeJS server runs on port `6001`.

```npm start```

### How to interact with Invotastic

#### Signup Invotastic Users

Now that Invotastic is up and running, you can sign up your first customer on the Invotastic Signup Page at the following location:

- `http://{application_vanity_domain}/signup`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Invotastic application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

This signup page is hosted by Wristband.  Completing the signup form will provision a new user.

#### Invotastic Home Page

For reference, the home page of this Inovtastic app can be accessed at the following locations:

- Localhost domain format: [http://localhost:6001/home](http://localhost:6001/home)
- Vanity domain format: [http://app.invotastic.com:6001/home](http://app.invotastic.com:6001/home)

#### Invotastic Application-level Login

Users of Invotastic can access the Invotastic Application-level Login Page at the following location:

- `http://{application_vanity_domain}/login`, where `{application_vanity_domain}` should be replaced with the value of the "Application Vanity Domain" value of the Invotastic application (can be found in the Wristband Dashboard by clicking the Application Details side menu of this app).

This login page is hosted by Wristband.  There is no notion of a Tenant-level Login Page for this demo app.

### Run the application in "dev" mode to experiment with the code and debug

You can run this demo application in "dev" mode in order to actively debug or experiment with any of the code.  This will require starting up the React client application in a separate CLI from the NodeJS server.  All API calls made from React to NodeJS are configured to be proxied in order to avoid CORS issues.

In one CLI, change to the `client` directory and run the following to start Vite's dev server (runs on port `6001`):

```npm start```

In a second separate CLI, start the NodeJS server in "dev" mode (runs on port `3001`):

```npm run dev```

All Invotastic URL locations should remain the same as when using the app in "production" mode.

### Setting up a local DNS when using vanity domain for the domain format
##### *<em>**Under Construction**</em>
<br/>

If you choose to use vanity domains as the domain format for the demo application, you will need to install a local DNS server to provide custom configurations.  This configuration forces any requests made to domains ending with `.app.invotastic.com` to get routed to your localhost.  This configuration is necessary since all vanity domains that get generated when running the demo application locally will have a domain suffix of  `*.app.invotastic.com`. Therefore, the above setting will force those domains to resolve back to your local machine instead of attempting to route them out to the web.

The goal is the following mapping:
`app.invotastic.com` => `127.0.0.1`.


Here are some options which you can use, depending on your operating system:

- Mac / Linux: [dnsmasq](http://mayakron.altervista.org/support/acrylic/Home.htm)
- Windows: [Acrylic](http://mayakron.altervista.org/support/acrylic/Home.htm)

More to setup-specific instructions to come...
