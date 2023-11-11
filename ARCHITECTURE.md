# Architecture

Tarrasque App is a monorepo that contains two apps:

## `ui`

The `ui` app is a frontend web application built with the following technologies:

- [Next.js](https://nextjs.org/): A framework for building server-rendered React applications.
- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.

The `ui` app uses [MUI](https://mui.com/) for the interface, and the following packages for form management and schema validation:

- [react-hook-form](https://react-hook-form.com/): A performance-focused library for managing forms in React.
- [yup](https://www.npmjs.com/package/yup): Dead simple Object schema validation.

HTTP requests are handled with the following packages:

- [@tanstack/react-query](https://tanstack.com/query): A React hook for fetching, caching, and updating data.
- [axios](https://axios-http.com/): A popular HTTP client library for JavaScript.

State management is handled with the following packages:

- [MobX](https://mobx.js.org/): A library for simple, scalable, reactive state management.
- [mobx-react-lite](https://www.npmjs.com/package/mobx-react-lite): A lightweight version of mobx-react with less React dependencies.

File uploads are supported through the following packages:

- [react-dropzone](https://react-dropzone.js.org/): A React component for creating drag-and-drop areas for file uploads.
- [Uppy](https://uppy.io/): A file uploading library that uses [Tus](https://tus.io/) for the actual uploading process.

The `ui` app also includes a rendering engine built with the following packages:

- [PixiJS](https://pixijs.com/): A fast, lightweight 2D rendering engine for the web.

WebSocket communication is supported with [socket.io-client](https://socket.io/docs/v4/client-api/).

## `api`

The `api` app is a backend web application built with the following technologies:

- [Nest.js](https://nestjs.com/): A framework for building efficient, scalable Node.js server-side applications.
- [TypeScript](https://www.typescriptlang.org/): A typed superset of JavaScript that compiles to plain JavaScript.

The `api` app uses the following technologies for database management and the actual database:

- [Prisma](https://www.prisma.io/): A modern database toolkit that makes it easy to build scalable and performant data APIs.
- [PostgreSQL](https://www.postgresql.org/): A powerful, open source object-relational database system.

File storage is handled through [Amazon S3](https://www.npmjs.com/package/@aws-sdk/client-s3).

WebSocket communication is supported with [socket.io](https://socket.io/).

The `api` app implements authentication using the following packages:

- [Passport](http://www.passportjs.org/): A simple, unobtrusive authentication library for Node.js.
- [Passport JWT](https://www.npmjs.com/package/passport-jwt): A Passport strategy for authenticating with a JSON Web Token.
- [Passport Local](https://www.npmjs.com/package/passport-local): A Passport strategy for authenticating with a username and password.

The `api` app implements email functionality using the following packages:

- [mjml](https://mjml.io/): A markup language designed to reduce the pain of coding a responsive email.
- [handlebars](https://handlebarsjs.com/): A simple templating language that keeps the view and the code separated like we all know they should be.
- [nodemailer](https://nodemailer.com/): A module for Node.js applications to allow easy as cake email sending.

The `api` app uses [argon2](https://www.npmjs.com/package/argon2) for password hashing. The `api` also includes support for JSON Web Tokens (JWTs) with [@nestjs/jwt](https://www.npmjs.com/package/@nestjs/jwt).

Additionally, the `api` app uses [@nestjs/swagger](https://www.npmjs.com/package/@nestjs/swagger) for generating API documentation using the [Swagger](https://swagger.io/) specification. It also uses [cuid](https://www.npmjs.com/package/cuid) for generating collision-resistant ids.
