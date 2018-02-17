import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import io from 'socket.io-client'
import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerReducer as router, routerMiddleware } from 'react-router-redux'

// import registerServiceWorker from './registerServiceWorker'
import { App } from './app'
import { messages } from './messages'

import themes from './themes'
import createSocketioMiddleware from './socketIoMiddleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createHistory()
const store = createStore(
    combineReducers({ router, themes, messages }),
    composeEnhancers( 
        applyMiddleware(
            thunk,
            createSocketioMiddleware(io(`${document.location.hostname}`)),
            routerMiddleware(history)
        )
     )
)

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>, 
    document.getElementById('root')
)
// registerServiceWorker()
