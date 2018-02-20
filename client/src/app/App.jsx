import React from 'react'
import { Route } from 'react-router'

import { ActiveTheme } from '../themes'
import { Lobby } from '../lobby'
import { Auth } from '../auth'
import { Group } from '../group'
import { Nav } from '../nav'
import { Profile } from '../profiles'

import css from './App.css'

export default () => (
    <ActiveTheme>
        <div className={css.App}>
            <Route exact path='/home' component={Lobby}/>
            <Route path='/login' component={Auth}/>
            <Route path='/profile/:id' component={Profile}/>
            <Route path='/me' component={Profile}/>
            <Route exact path='/' render={() => (
                <React.Fragment>
                    <Nav />
                    <Group />
                </React.Fragment>
            )}/>
        </div>
    </ActiveTheme>
)