import React from 'react'

import Nav from './containers/Nav'
import { Theme, Group, Auth, TitleBar } from './containers'

import css from './index.css'

export default class App extends React.Component {    
    render(){
        return <Theme>
            <div className={css.App}>
                <TitleBar />
                <Auth>
                    <Nav />
                    <Group/>
                </Auth>
            </div>
        </Theme>
    }   
}