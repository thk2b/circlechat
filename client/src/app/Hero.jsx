import React from 'react'

import './Hero.css'
import { UsersStats } from '../usersStats'

export default () => (
    <header className="Hero">
        <h1>MessageBoard</h1>
        <UsersStats />
    </header>
)