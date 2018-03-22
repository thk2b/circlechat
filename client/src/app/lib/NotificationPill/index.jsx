import React from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => ({
    root: {
        backgroundColor: theme.palette.primary.dark,
        borderRadius: '50%',
        width: '18px',
        height: '18px',
        textAlign: 'center',
        color: theme.palette.text.primary,
        lineHeight: '1.1rem'
    }
})

export default withStyles(styles)(({ classes, count, hasMore }) => {
    if(! count ) return null
    return <span className={classes.root} >
        { hasMore && '+'}{ count }
    </span>
})