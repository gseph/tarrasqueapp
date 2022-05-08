# Tarrasque App

## Setup

Run the following commands to install the dependencies for Tarrasque App, as well as Terry, the CLI helper for running Tarrasque App commands:

    ./bin/setup.sh

### Install dependencies

This will run `yarn` on each workspace.

    terry install

### Set environment variables

There's a `.env.example` file in the root folder. Copy `.env.example` to `.env` and set the variables as needed.

## Usage

### Run development server

To start the Docker development server, run:

    terry dev

You can then access the development server at `http://localhost:10000`.

### Run production server

To start the Docker production server, run:

    terry prod

You can then access the production server at `http://localhost:10000`.

## Database

### Create database

Push the state from Prisma schema to the database during prototyping.

    yarn server prisma db push

Seed the database with sample data.

    yarn server prisma db seed
