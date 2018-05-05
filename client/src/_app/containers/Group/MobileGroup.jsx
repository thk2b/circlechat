import React from 'react'
import Grid from '@thk2b/oui/lib/Grid'
import { Route, Switch } from 'react-router'

import Profile, { ProfilesSidebar, ProfilesSidebarHeader, ProfileHeader } from '../Profile'
import Channel, { ChannelsSidebar, ChannelsSidebarHeader, ChannelHeader, CreateChannel } from '../Channel'
import Nav from '../Nav'

export default class MobileGroup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            viewIndex: 0
        }
    }

    render(){
        return <Grid.Container
            rows="60px 60px 1fr"
            columns="60px 1fr 60px"
            areas="
                'nav nav nav'
                'iconLeft contentHeader iconRight'
                'content content content'
            "
        >
            <Grid.Area nav Component={Nav} />
            <Grid.Area iconLeft>
                <header>
                    <h2>#</h2>
                </header>
            </Grid.Area>
            <Grid.Area contentHeader>
                <Route path='/channel/create'><header><h2>New Channel</h2></header></Route>
                    <Route path='/channel/:id' component={ChannelHeader}/>
                    <Route path='/profile/:id' component={ProfileHeader}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => 'Group content goes here'}/>
                </Grid.Area>
            <Grid.Area iconRight>
                <header>
                    <h2>O</h2>
                </header>
            </Grid.Area>
            <Grid.Area content>
                <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => 'Group content goes here'}/>
                </Grid.Area>
        </Grid.Container>
    }
}