import React from 'react'
import { Route } from 'react-router'

import Nav from './containers/Nav'
import { Profile, Group, Auth, Theme } from './containers'

import css from './index.css'

export default () => (
    <Theme>
        <div className={css.App}>
            <Auth>
                <Nav />
                <Group />
            </Auth>
        </div>
    </Theme>
)