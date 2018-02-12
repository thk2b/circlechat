# webchat
A web based chat platform

# todo
- [x] [WEB] api tests - `mocha`, `chai-http`

- [x] [DB] setup create tables file
- [x] [DB] setup drop tables file
- [x] [WEB] remove sequelize: use SQL-template-strings
- [ ] [WEB, CLIENT] refactor socket.io: emit actions directly
- [ ] [CLIENT] use redux middleware for API calls
- [ ] [CLIENT] write tests: create a store and verify that containers dispatch actions
- [ ] [WEB] write tests: API and socket.io. Use `supertest`
- [ ] [WEB, CLIENT] add auth & test

# commands

- `dc -f docker-compose.dev.yml (build|up)`
- `dc -f docker-compose.dev.yml run web node app/manage/create_db` or `dc exec web node ...`
- `dc exec psql -U ...`

