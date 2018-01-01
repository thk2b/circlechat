import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware } from 'redux'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

// import registerServiceWorker from './registerServiceWorker'
import './index.css'
import App from './App'
import messages from './messages'

let socket = io(`${document.location.hostname}`)
let socketIoMiddleware = createSocketIoMiddleware(socket, 'io/')

let rootReducer = combineReducers({ messages })
let initialState = { messages: {} }
let middleware = applyMiddleware(socketIoMiddleware)

let store = createStore(
    rootReducer,
    initialState,
    middleware
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
)
// registerServiceWorker()
