import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import io from 'socket.io-client'

import createHistory from 'history/createBrowserHistory'
import { routerReducer as router, routerMiddleware } from 'react-router-redux'

import themes from './themes'
import auth from './auth'
import profiles from './profiles'


import { createApiMiddleware, createSocketIoMiddleware } from './middleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createHistory()
export const store = createStore(
    combineReducers({ router, themes, auth, profiles }),
    composeEnhancers( 
        applyMiddleware(
            thunk,
            createApiMiddleware(`/api/v1`),
            createSocketIoMiddleware(io(`${document.location.hostname}`)),
            routerMiddleware(history)
        )
     )
)