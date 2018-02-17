import React from 'react'
import { Route } from 'react-router'

import { ActiveTheme } from '../themes'

import css from './App.css'

export default () => (
    <ActiveTheme>
        <div className={css.App}>
            <Route path='*/login' render={()=> <p>please login</p>} />
        </div>
    </ActiveTheme>
)