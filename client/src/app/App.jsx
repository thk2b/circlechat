import React from 'react'
import { Route } from 'react-router'

import { Messages } from '../messages'

import Hero from './Hero.jsx'
import './App.css'

export default () => (
    <div className='App'>
        <Hero />
        <Route path='*/login' render={()=> <p>please login</p>} />
        <Route path='/' component={Messages} />
    </div>
)