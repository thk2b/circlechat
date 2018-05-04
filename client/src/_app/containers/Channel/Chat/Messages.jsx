import React from 'react'
import Autoscroll from 'autoscroll-react'
import styled from 'styled-components'

import Message from './Message'

const Ul = styled.ul`
    flex: 1;
    min-height: 0px;
    overflow-y: scroll;
`

class Messages extends React.Component {
    render(){
        return <Ul {...this.props}>
            {this.props.messages.map(
                message => <Message
                    key={message.id}
                    message={message}
                />
            )}
        </Ul>
    }
}

export default Autoscroll(Messages)
