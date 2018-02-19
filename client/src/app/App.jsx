import React from 'react'
import { Route } from 'react-router'

import { ActiveTheme } from '../themes'
import { Lobby } from '../lobby'
import { Auth } from '../auth'
import { Group } from '../group'
import { Nav } from '../nav'

import css from './App.css'

export default () => (
    <ActiveTheme>
        <div className={css.App}>
            <Route exact path='/home' component={Lobby}/>
            <Route path='/login' component={Auth}/>
            <Route exact path='/' render={() => (
                <React.Fragment>
                    <Nav />
                    <Group />
                </React.Fragment>
            )}/>
        </div>
    </ActiveTheme>
)