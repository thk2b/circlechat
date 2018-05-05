import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

// import registerServiceWorker from './registerServiceWorker'
import Theme from './app/containers/Theme'
import App from './app'

import { history, store } from './store'

ReactDOM.render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <App />
        </ConnectedRouter>
    </Provider>, 
    document.getElementById('root')
)
// registerServiceWorker()