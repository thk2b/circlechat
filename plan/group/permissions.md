# Permissions

Permissions correspond to the actions users are allowed to take in a group. 

There are permissions concerning three entities.

- 1] channels
  - 1] view
  - 2] post
  - 3] create
  - 4] edit/remove_content
  - 5] edit/remove_channels
- 2] users
  - 1] add
  - 2] remove
  - 3] manage_roles (1)
- 3] the group in itself
  - 1] edit
  - 2] delete
 
If a user has permission 1.3, then she also has permissions 1.2 and 1.1 but not 2.1.
 
Upon creating a group, the creator specifies the default permission new users will have.
 ___
 
(1) a user cannot grant others with permissions he does not already have
 
