import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import MdClear from 'react-icons/lib/md/clear'

import { Card, CardHeader, CardText } from 'material-ui/Card'

import { Editable, Link, Time } from '../../lib'

import { update, remove } from '../../../store/modules/messages'

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
        <CardHeader
            title={<span
                onClick={e => goToProfile()}
            >
                { profileName }
            </span>}
            subtitle={<React.Fragment>
                <Time since={createdAt} updateInterval={60*1000}/>
                {/* TODO: add deleted / updated at time */}
            </React.Fragment>}
        />
        <CardText>{ text }</CardText>
    </Card>

    return <article className={css.Message}>
        {deleted
            ?<p>[deleted]</p>
            :<Editable
                as='p'
                value={text}
                onSubmit={text => updateMessage(text)}
            />
        }
        <aside>
            <Link onClick={e => goToProfile()}>{ profileName }</Link>
            <p>
                <Time since={createdAt} updateInterval={60*1000}/>
            </p>
            
            {(createdAt !== updatedAt) && <p>
                {deleted?'deleted':'updated'} { <Time since={updatedAt} updateInterval={60*1000}/> }
            </p>}
            
            {!deleted && <MdClear onClick={e => deleteMessage()} />}
        </aside>
    </article>
}

export default connect(mapState, mapDispatch, mergeProps)(Message)