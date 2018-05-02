import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'

// import registerServiceWorker from './registerServiceWorker'
import Theme from './app/containers/Theme'
import App from './_app'

import { history, store } from './store'

ReactDOM.render(
    <Provider store={store}>
        <Theme>
            <ConnectedRouter history={history}>
                <App />
            </ConnectedRouter>
        </Theme>
    </Provider>, 
    document.getElementById('root')
)
// registerServiceWorker()