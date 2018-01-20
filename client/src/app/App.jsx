import React from 'react'

import { Messages } from '../messages'
import { UsersStats } from '../usersStats'
import Hero from './Hero.jsx'
import './App.css'

export default () => (
    <div className='App'>
        <Hero />
        <UsersStats />
        <Messages />
    </div>
)