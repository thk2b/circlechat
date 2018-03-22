import React from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        display: 'inline-block',
        width: '18px',
        height: '18px',
        borderRadius: '50%',
        marginLeft: '1rem',
        verticalAlign: 'bottom',
    },
    online: {
        backgroundColor: theme.palette.primary.main,
    },
    offline: {
        backgroundColor: theme.palette.grey[500]
    }
})

export default withStyles(styles)(({ classes, status = 'INVISIBLE' }) => {
    if(status === 'INVISIBLE') return null
    return <span className={classNames(
        classes.root,
        classes[status.toLowerCase()])}
    />
})