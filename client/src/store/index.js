import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
// import thunk from 'redux-thunk'
import io from 'socket.io-client'

import createHistory from 'history/createBrowserHistory'
import { routerReducer as router, routerMiddleware } from 'react-router-redux'

import * as reducers from './modules'

import { apiMiddleware, socketIoMiddleware, redirectMiddleware } from './middleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createHistory()
export const store = createStore(
    combineReducers( reducers ),
    composeEnhancers( 
        applyMiddleware(
            // thunk,
            apiMiddleware(`/api/v1`),
            socketIoMiddleware(io, document.location.hostname),
            redirectMiddleware,
            routerMiddleware(history)
        )
     )
)