import React from 'react'
import { connect } from 'react-redux'

const mapState = ({ notifications }) => {
    return {
        notifications: notifications.total
    }
}

class TitleBar extends React.Component {
    render() {
        const { notifications } = this.props

        if(!notifications){
            document.title = 'CircleChat'
        } else {
            document.title = `[${ notifications }] CircleChat`
        }
        return null
    }
}

export default connect(mapState)(TitleBar)
