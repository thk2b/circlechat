# ACTIONS

## `auth`
- register
- login
  - => emit update_status to all related users who are online
  - send initial data to the user: `{me, circles, channels, users, messages}`
- (forgot_passowrd)

## `user/:id`
User herself:
- edit_username 
  - => emit update_username to all related users who are online
- edit_password
- edit_email
- set_status
  - => emit update_status to all related users who are online

All users:
- get_profile

## `circles`
- create
- search
- find_popular
- get_new

## `circle/:id`
All users:
- join
  - => emit update_users to all members of the circle
- leave
  - => emit update_users to all members of the circle
- mute

Users with `mod` permission:
- add_user(s)
  - => emit update_users to all members of the circle
- remove_user(s)
  - => emit update_users to all members of the circle
- edit_user_permission
  - => emit update_permission to the user in question
- edit (+) 
  - => emit update_circle to all members of the circle

Users with `publish` permission:
- create_channel
  - => emit new_channel to all members of the circle who have the view permission

Users with `view` permission:
- get_channels
- get_users

## `channel/:id`
Users with `mod` permission, or the channel's creator:
- edit (+)
  - => emit update_channel to all members of the circle with the view permission
- delete
  - => emit delete_channel to all members of the circle with the view permission
  
Users with `publish` permission:
- send_message
  - => emit new_message to all members of the circle with the view permission

Users with `view` permission:
- get_content (get a number of messages)
- get_more_content (get a number of messages after a specific message)



## `message/:id`
Users with `mod` permission, or the message's author
- edit
  - => emit update_message to all members of the circle with the view permission
- delete
  - => emit delete_message to all members of the circle with the view permission

Users with `view` permisison:
- get_message
