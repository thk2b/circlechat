import * as c from './constants'
import axios from 'axios'

export const addMessage = ( message ) => ({
    type: c.ADD_MESSAGE,
    message
})

export const addMessages = ( messages ) => ({
    type: c.ADD_MESSAGES,
    messages
})

export const submitMessage = ( text ) => ({
    type: 'io/SUBMIT_MESSAGE',
    text
})

export const fetchMessages = () => dispatch => {
    axios.get(`http://${document.location.hostname}/api/messages`)
        .then(
            ({ data }) => dispatch(addMessages(data.messages))
        )
        .catch(console.error)
}