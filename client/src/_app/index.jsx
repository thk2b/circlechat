import React from 'react'

import {
    Theme,
    Home,
    Nav,
    Group
} from './containers'

export default () => {
    return (
        <Theme>
            <Home>
                <Nav />
                <Group />
            </Home>
        </Theme>
    )
}