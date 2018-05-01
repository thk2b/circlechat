import React from 'react'

import {
    Theme,
    Home,
    Nav,
    Group
} from './containers'

export default () => {
    return <main>
        <Theme>
            <Home>
                <Nav />
                <Group />
            </Home>
        </Theme>
    </main>
}