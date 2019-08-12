# circlechat
A web based chat platform.

![screenshot](https://raw.githubusercontent.com/thk2b/circlechat/master/media/screenshot.png)

# About the project

Circlechat is a web based chat application. The core service provided is the instant transmission of messages between users.

In Circhechat, users can
- login, register, and edit their profile
- create channels and update the channels they created
- send messages to channels and edit their own messages
- view whether other users are online

Whenever a channel, message or profile's data is changed it is updated in real time on all clients. This means that when a user updates her profile description, or posts a message, all clients are notified and update the view accordingly.

# Architecture

Circlechat is orchestrated through docker. There are 4 containers: 
- client: a react-redux javascript client
- web: a REST API and websocket server written in nodeJS
- nginx: an nginx server and reverse proxy, which either serves the client application or routes requests to the API server
- db: a postgresql database

The application can be deployed in two environments:

- dev, meant for development. Features include automatically restarting the client and webserver on code changes for fast development.
  
- production, optimized for user-facing deployment. For instance, the client is built and minified.
  
## Client

While the client served to all devices, mobile and desktop alike, the view is adapted to the screen size. The mobile layout makes use of touchscreen features, such as swiping between views. On larger screens, more information is displayed.

The client is a single page application, build with react (+react router) and redux. The layout is implemented with css grid.

- available under two color themes (light and dark).
- infinite scroll: more messages are fetched when the user has scrolled to the top of a chat.
- loading bars indicate that a server response is pending.

The store is unit-tested with jest with `docker-compose run client npm test`

## Web

The web container is a nodeJS applcation responsible for the rest API and websockets.

The codebase is separated into modules (auth, profiles, channels, messages). Each module is made up of:

- a `service` file which handles database interactions
- a `router` file where express API routes are defined
- an `events` file which subscribes to websocket events

It is unit tested with mocha with `docker-compose run web npm test`

### REST API

|endpoint|method|params|response|description|
|-|-|-|-|-|
|`/api/v1/auth/login/`|`POST`|`{email, pw}`|`{token, userId, lastLogoutAt}`|login with userId or email. The response includes a JWT token to be sent back with every subsequent request|
|`/api/v1/auth/`|`POST`|`{email, pw`|`none`|register a new user|
|`/api/v1/auth/password`|`PUT`|`{currentPw, newPw}`|`{user}`|update a user's password|
|`/api/v1/auth/email`|`PUT`|`{pw, newEmail}`|`{user}`|update a user's email|
|`/api/v1/auth/:id`|`GET`|`none`|`{userId, email}`|get a user's information|
|`/api/v1/auth/:id`|`DELETE`|`none`|`none`|delete a user|
|`api/v1/channel/`|`POST`|`{profileId, name}`|`{profileId, name, createdAt, updatedAt}`|create a channel for profile with id|
|`api/v1/channel?id`|`GET`|`none`|`{profileId, name, createdAt, updatedAt}`|get a channel's information|
|`api/v1/channel/`|`PUT`|`{name}`|`{id, updatedAt}`|update a channel|
|`api/v1/channel?`|`DELETE`|`none`|`none`|delete a channel|
|`api/v1/channel/all`|`GET`|`none`|`{channels: [{profileId, name, createdAt, updatedAt}]`|update a channel|
|`api/v1/message/`|`POST`|`{profileId, channelId, text}`|`{profileId, channelId, text, createdAt, updatedAt}`|create a new message for user in channel|
|`api/v1/message?id`|`GET`|`none`|`{profileId, channelId, text, createdAt, updatedAt}`|get a message|
|`api/v1/message?id`|`PUT`|`{text}`|`{profileId, channelId, text, createdAt, updatedAt}`|update a message|
|`api/v1/message?id`|`DELETE`|`none`|`none`|delete a message|
|`api/v1/message/all?id?n?after`|`GET`|`none`|`{messages: [{profileId, channelId, text, createdAt, updatedAt}], hasMore}`|get n or all messages maybe after a specific message, in a channel or in all channels|
|`api/v1/profile/`|`POST`|`{userId, name?, description?, status?}`|`{userId, name, description, status}`|create a new profile|
|`api/v1/profile?id`|`GET`|`none`|`{userId, name, description, status}`|get profile with id|
|`api/v1/profile?userId`|`GET`|`none`|`{userId, name, description, status}`|get the profile of a user|
|`api/v1/profile?id`|`PUT`|`{name, description, status}`|`{userId, name, description, status}`|update profile with id|
|`api/v1/profile?id`|`DELETE`|`none`|`none`|delete profile with id|
|`api/v1/profile/all`|`GET`|`none`|`{profiles: [{userId, name, description, status}]}`|get all profiles|


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

# State of development

Currently, circlechat is a MVP. All desired features have yet to be implemented. Namely, all chat and profile features are present, but there exists only one global circle: all users are automatically added to a global circle, which holds all channels and profiles. The next major development step is the implementation of user-created circles, each with their own channels and profiles.
