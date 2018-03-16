import React from 'react'

import Nav from './containers/Nav'
import { Group, Auth, Theme, TitleBar } from './containers'

import css from './index.css'

export default () => (
    <Theme>
        <div className={css.App}>
            <TitleBar />
            <Auth>
                <Nav />
                <Group />
            </Auth>
        </div>
    </Theme>
)