import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import createSocketIoMiddleware from 'redux-socket.io'
import io from 'socket.io-client'

// import registerServiceWorker from './registerServiceWorker'
import { App } from './app'
import { messages } from './messages'

let socket = io(`${document.location.hostname}`)

socket.on('message', data => console.log(data))
socket.emit('test', 1)

let socketIoMiddleware = createSocketIoMiddleware(socket, 'io/')

let reducer = combineReducers({ messages })
let middleware = applyMiddleware(thunk, socketIoMiddleware)

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
    reducer,
    composeEnhancers( middleware )
)

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
)
// registerServiceWorker()
