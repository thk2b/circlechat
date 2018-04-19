import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import io from 'socket.io-client'

import createHistory from 'history/createBrowserHistory'
import { routerReducer as router, routerMiddleware } from 'react-router-redux'

import * as reducers from './modules'

import {
    websocketMiddleware,
    deviceMiddleware
} from './middleware'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createHistory()

const create = () => createStore(
    combineReducers({...reducers, router }),
    composeEnhancers(
        applyMiddleware(
            thunk,
            websocketMiddleware(io, document.location.hostname),
            deviceMiddleware(window),
            routerMiddleware(history)
        )
    )
)
export default create

export const store = create()