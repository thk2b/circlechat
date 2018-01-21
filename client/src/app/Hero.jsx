import React from 'react'

import './Hero.css'
import { UsersStats } from '../usersStats'
import { AuthLink } from '../auth'

export default () => (
    <header className="Hero">
        <h1>MessageBoard</h1>
        <UsersStats />
        <AuthLink />
    </header>
)