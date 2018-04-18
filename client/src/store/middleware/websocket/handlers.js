import { actions as messagesActions } from '../../modules/messages'
import { actions as profilesActions } from '../../modules/profiles'
import { actions as channelsActions } from '../../modules/channels'
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
        case 'DELETE':
        case 'PUT':
            dispatch(
                messagesActions.update(meta.params.id, message => ({
                    ...message, ...data
                }))
            )
    }
}

const profileHandler = ({ meta, data }, { dispatch, getState }) => {
    switch (meta.type){
        case 'POST':
            dispatch(
                profilesActions.set(data.profile.id, data.profile)
            )
        case 'DELETE':
            dispatch(
                profilesActions.delete(meta.params.id)
            )
        case 'PUT':
            dispatch(
                profilesActions.update(meta.params.id, profile => ({
                    ...profile, ...data
                }))
            )
    }
}

const channelHandler = ({ meta, data }, { dispatch, getState }) => {
    switch (meta.type){
        case 'POST':
            dispatch(
                channelsActions.set(data.channel.id, data.channel)
            )
        case 'DELETE':
            dispatch(
                channelsActions.delete(meta.params.id)
            )
        case 'PUT':
            dispatch(
                channelsActions.update(meta.params.id, channels => ({
                    ...channels, ...data
                }))
            )
    }
}