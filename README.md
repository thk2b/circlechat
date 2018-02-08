# webchat
A web based chat platform

# ideas
- [EITHER] treat the `web` container as a client of the database. It does not create nor drop tables or alter schemas. But this means that tests cannot be performed on a clean database. Or, in test lifecycle hooks, delete all rows.
- [OR] use `pg-migrate` on the `web` container to manage tables. 
- [OR] have `*.sql` files in `app/db`, such as `create.sql` and `drop.sql`. Read these files at runtime and pass them to the driver. 

# TODO
- [ ] [WEB] api tests - `tape`, `superset`

- [ ] [DB] setup create tables file
- [ ] [DB] setup drop tables file
- [ ] [WEB] remove sequelize: use SQL-template-strings
- [ ] [WEB, CLIENT] refactor socket.io: emit actions directly
- [ ] [CLIENT] use redux middleware for API calls
- [ ] [CLIENT] write tests: create a store and verify that containers dispatch actions
- [ ] [WEB] write tests: API and socket.io. Use `supertest`
- [ ] [WEB, CLIENT] add auth & test

# commands

- `dc -f docker-compose.dev.yml (build|up)`
- `dc -f docker-compose.dev.yml run web node app/manage/create_db` or `dc exec web node ...`
- `dc exec psql -U ...`