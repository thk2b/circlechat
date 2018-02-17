import React from 'react'
import { Route } from 'react-router'

import css from './App.css'

export default () => (
    <div className='App'>
        <Route path='*/login' render={()=> <p>please login</p>} />
    </div>
)