import React from 'react'
import { Route } from 'react-router'

import Nav from './containers/Nav'
import { Profile, Group, Auth, ActiveTheme } from './containers'

import css from './index.css'

export default () => (
    <ActiveTheme>
        <div className={css.App}>
            <Auth>
                {/* <Route exact path='/home' component={Lobby}/> */}
                <Route path='/profile/:id' component={Profile}/>
                <Route path='/me' component={Profile}/>
                <Route exact path='/' render={() => (
                    <React.Fragment>
                        <Nav />
                        <Group />
                    </React.Fragment>
                )}/>
            </Auth>
        </div>
    </ActiveTheme>
)