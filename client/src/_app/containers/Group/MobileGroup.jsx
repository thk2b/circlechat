import React from 'react'
import Grid from '@thk2b/oui/lib/Grid'
import { Route, Switch } from 'react-router'
import SwipeableViews from 'react-swipeable-views'

import Profile, { ProfilesList, ProfilesSidebarHeader, ProfileHeader } from '../Profile'
import Channel, { ChannelsList, ChannelsSidebarHeader, ChannelHeader, CreateChannel } from '../Channel'
import Nav from '../Nav'

export default class MobileGroup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            viewIndex: 1
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
                <header
                    onClick={e => this.setState({ viewIndex: 0 })}
                >
                    <h2>#</h2>
                </header>
            </Grid.Area>
            <Grid.Area contentHeader>
                {this.state.viewIndex === 0
                    ? <header><h2>Channels</h2></header>
                    : this.state.viewIndex === 1
                    ? <Switch>
                        <Route path='/channel/create'><header><h2>New Channel</h2></header></Route>
                        <Route path='/channel/:id' component={ChannelHeader}/>
                        <Route path='/profile/:id' component={ProfileHeader}/>
                        <Route path='/me' component={Profile}/>
                        <Route exact path='/' render={() => 'Group content goes here'}/>
                    </Switch>
                    :<header><h2>Profiles</h2></header>
                }
                </Grid.Area>
            <Grid.Area iconRight>
                <header
                    onClick={e => this.setState({ viewIndex: 2 })}
                >
                    <h2>O</h2>
                </header>
            </Grid.Area>
            <Grid.Area content style={{ overflow: 'hidden' }}>
                <SwipeableViews
                    index={this.state.viewIndex}
                    onChangeIndex={index => this.setState({ viewIndex: index })}
                    style={{ height: '100%' }}
                >
                    <ChannelsList
                        afterItemClick={e => this.setState({ viewIndex: 1 })}
                    />
                    <Switch>
                        <Route path='/channel/create' component={CreateChannel}/>
                        <Route path='/channel/:id' component={Channel}/>
                        <Route path='/profile/:id' component={Profile}/>
                        <Route path='/me' component={Profile}/>
                        <Route exact path='/' render={() => 'Group content goes here'}/>
                    </Switch>
                    <ProfilesList
                        afterItemClick={e => this.setState({ viewIndex: 1 })}
                    />
                </SwipeableViews>
            </Grid.Area>
        </Grid.Container>
    }
}