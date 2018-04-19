import { actions as messagesActions } from '../../modules/messages/base'
import { actions as profilesActions } from '../../modules/profiles/base'
import { actions as channelsActions } from '../../modules/channels/base'
import { loadingActions } from '../../modules/loading'

//TODO: handle loading / errors

const messageHandler = ({ meta, data }, { dispatch, getState }) => {
    switch (meta.type){
        case 'POST':
            dispatch(
                messagesActions.set(data.message.id, data.message)
            )
            dispatch(
                loadingActions.update('messages', loading => ({
                    ...loading,
                    new: false
                }))
            )
            return
        case 'DELETE':
        case 'PUT':
            return dispatch(
                messagesActions.update(data.id, message => ({
                    ...message, ...data
                }))
            )
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
    }
}

export default {
    '/message': messageHandler,
    '/profile': profileHandler,
    '/channel': channelHandler
}