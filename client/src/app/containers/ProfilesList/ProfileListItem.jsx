import React from 'react'

import ListItem from 'material-ui/List/ListItem'
import { Status } from '../../lib'

export default ({onClick, name, status, ...rest}) => {
    return <ListItem onClick={onClick}
        {...rest}
    >
        <span>{name}</span>
        <Status status={status}/>
    </ListItem>
}
