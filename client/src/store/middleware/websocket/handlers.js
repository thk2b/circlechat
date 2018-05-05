import { actions as messagesActions } from '../../modules/messages/base'
import { actions as profilesActions } from '../../modules/profiles/base'
import { actions as channelsActions } from '../../modules/channels/base'
import { notificationsActions } from '../../modules/notifications'
import { loadingActions } from '../../modules/loading'

const messageHandler = ({ meta, data }, { dispatch, getState }) => {
    switch (meta.type){
        case 'POST':
            const { ownProfileId } = getState()
            const { message } = data
            dispatch(messagesActions.set(message.id, message))

            if(message.profileId !== ownProfileId){
                dispatch(notificationsActions.increment(message.channelId))
            } else {
                dispatch(loadingActions.update('messages', loading => ({
                    ...loading,
                    new: false
                })))
            }
            return
        case 'DELETE':
        case 'PUT':
            return dispatch(
                messagesActions.update(data.id, message => ({
                    ...message, ...data
                }))
            )
        default: throw new Error('invalid ws action type', { meta, data })
    }
}

const profileHandler = ({ meta, data }, { dispatch, getState }) => {
    switch (meta.type){
        case 'POST':
            return dispatch(
                profilesActions.set(data.profile.id, data.profile)
            )
        case 'DELETE':
            return dispatch(
                profilesActions.delete(meta.params.id)
            )
        case 'PUT':
            return dispatch(
                profilesActions.update(data.id, profile => ({
                    ...profile, ...data
                }))
            )
        default: throw new Error('invalid ws action type', { meta, data })
    }
}

const channelHandler = ({ meta, data }, { dispatch, getState }) => {
    switch (meta.type){
        case 'POST':
            return dispatch(
                channelsActions.set(data.channel.id, data.channel)
            )
        case 'DELETE':
            return dispatch(
                channelsActions.delete(meta.params.id)
            )
        case 'PUT':
            return dispatch(
                channelsActions.update(data.id, channels => ({
                    ...channels, ...data
                }))
            )
        default: throw new Error('invalid ws action type', { meta, data })
    }
}

export default {
    '/message': messageHandler,
    '/profile': profileHandler,
    '/channel': channelHandler
}