# PLAN

## ACTIONS

### `auth`
- register
- login
- (forgot)

### `user/:id`
- edit_username
- edit_password
- edit_email
- set_status
- get_profile

### `circles`
- create
- search
- find_popular
- get_new

### `circle/:id`
All users:
- join
- leave
- mute

Users with `mod` permission:
- add_user(s)
- remove_user(s)
- edit_user_permission
- edit (+)

Users with `publish` permission:
- create_channel

Users with `view` permission:
- get_channels
- get_users

### `channel/:id`
Users with `mod` permission, or the channel's creator:
- edit (+)
- delete

Users with `publish` permission:
- send_message

Users with `view` permission:
- get_content

### `message/:id`
Users with `mod` permission, or the message's author
- edit
- delete

Users with `view` permisison:
- get_message
