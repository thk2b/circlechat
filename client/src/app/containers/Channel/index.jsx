import React from 'react'
import { connect } from 'react-redux'

const mapState = ({}) => {
    return {}
}

const mapDispatch = dispatch => {
    return {}
}

class Channel extends React.Component {
    render(){
        return <div>
            channel
        </div>
    }
}


export default connect(mapState, mapDispatch)(Channel)
