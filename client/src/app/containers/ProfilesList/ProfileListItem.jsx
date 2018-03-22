import React from 'react'

import { ListItem, ListItemText } from 'material-ui/List'
import { Status } from '../../lib'

export default ({onClick, name, status, ...rest}) => {
    return <ListItem button
        onClick={onClick}
        {...rest}
    >
        <ListItemText primary={name} />
        <Status status={status}/>
    </ListItem>
}