# circlechat
A web based chat platform.

For a quick overview, [view demo screen captures](https://imgur.com/gallery/vyppnTj).

# About the project

Circlechat is a web based chat application. The core service provided is the instant transmission of messages between users.

The main entity in Circhechat is a circle: a set of profiles and channels. Messages are exchanged through channels. Profiles contain a user's information, such as a name, description or whether the user is online.

Whenever a channel, message or profile's data is changed, it is updated, in real time, on all clients. This means that when a user updates her profile description, or posts a message, all clients are notified and update accordingly.

# Architecture

Circlechat is orchestrated through docker. There are 4 containers: 
- client: a react-redux javascript client
- web: a REST API and websocket server written in nodeJS
- nginx: an nginx server and reverse proxy, which either serves the client application or routes requests to the API server
- db: a postgresql database

The application can be deployed in two environments:

- dev

  The dev environment is meant for development. Features include automatically restarting the client and webserver on code changes for fast development.
  
- production

  The production environment is optimized for user-facing deployment. For instance, the client is built and minified.
  
## Client

While the client served to all devices, mobile and desktop alike, the view is adapted to the screen size. The mobile layout makes use of touchscreen features, such as swiping between menus. For larger screens, more information is displayed.

The client is a single page application, build with react (+react router) and redux. The layout is implemented with css grid.

- available under two color themes (light and dark).
- infinite scroll: more messages are fetched when the user has scrolled to the top of a chat.
- loading bars indicate that a server response is pending.


The store is unit-tested with jest. The test command is `docker-compose run client npm test`.

## Web

The web container is a nodeJS applcation responsible for the rest API and websockets.

The codebase is separated into modules (auth, profiles, channels, messages). Each module is made up of:

- a `service` file which handles database interactions
- a `router` file where express API routes are defined
- an `events` file which subscribes to websocket events

It is unit tested with mocha. Tests cover database interactions, and http and websocket networking. The command is `docker-compose run web npm test`


# State of development

Currently, circlechat is a MVP. All desired features have yet to be implemented. Namely, all chat and profile features are present, but there exists only one global circle: all users are automatically added to a global circle, which holds all channels and profiles. The next major development step is the implementation of user-created circles, each with their own channels and profiles.

# Commands

- start in dev environment
  - create a docker machine
  - create a .env file (see docker-compose.yml for the required variables)
  - `docker-compose -f docker-compose.dev.yml build`
  - run `docker-compose -f docker-compose.dev.yml run web node app/manage/create` to create the database tables
  - `docker-compose -f docker-compose.dev.yml up`

- start in prod environment
  - create a docker machine
  - create a .env file (see docker-compose.yml for the required variables)
  - `docker-compose build`
  - run `docker-compose run web node app/manage/create` to create the database tables
  - `docker-compose up -d`

