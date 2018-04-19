import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'

import Card, { CardContent, CardText } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import { Editable, Link, Time } from '../../lib'

import { update, remove } from '../../../store/modules/messages/networkActions'
import css from './Message.css'

const mapState = ({ profiles }, { profileId }) => {
    const profile = profiles.data[profileId]
    return {
        profileName: profile && profile.name
    }
}

const mapDispatch = dispatch => {
    return bindActionCreators({ update, remove, push }, dispatch)
}

const mergeProps = (state, actions, ownProps ) => {
    return {
        ...state,
        ...ownProps,
        updateMessage: text => actions.update(ownProps.id, { text }),
        deleteMessage: () => actions.remove(ownProps.id),
        goToProfile: () => actions.push(`/profile/${ownProps.profileId}`)
    }
}

const Message = ({
    text, profileName, createdAt, updatedAt,
    updateMessage, deleteMessage, goToProfile
}) => {
    const deleted = text === null

    return <Card className={css.Message}>
        <CardContent>
            <Typography>
                <Link
                    onClick={e => goToProfile()}
                >
                    { profileName }
                </Link>
                <br/>
                <Time since={createdAt} updateInterval={60*1000}/>
            </Typography>
            {deleted
            ?<Typography>[deleted]</Typography>
            :<Editable
                isDeletable
                value={text}
                onSubmit={text => text && updateMessage(text)}
                onDelete={() => deleteMessage()}
            >
                <Typography>{ text }</Typography>
            </Editable>
        }
        </CardContent>
    </Card>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)