import React from 'react'
import Grid from '@thk2b/oui/lib/Grid'
import { Route, Switch } from 'react-router'
import SwipeableViews from 'react-swipeable-views'
import MdGroup from 'react-icons/lib/md/group'
import MdRssFeed from 'react-icons/lib/md/rss-feed'


import Profile, { ProfilesList, ProfileHeader } from '../Profile'
import Channel, { ChannelsList, ChannelHeader, CreateChannel } from '../Channel'
import Nav from '../Nav'
import Logo from '../Logo'
import LabeledIcon from '../../lib/LabeledIcon'

export default class MobileGroup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            viewIndex: 1
        }
    }
    render(){
        return <Grid.Container
            rows="65px 65px 1fr"
            columns="65px 1fr 65px"
            areas="
                'logo nav nav'
                'iconLeft contentHeader iconRight'
                'content content content'
            "
        >
            <Grid.Area logo Component={Logo} />
            <Grid.Area nav>
                <Nav afterProfileClick={e => this.setState({ viewIndex: 1 })}/>
            </Grid.Area>

            <Grid.Area iconLeft>
                <header
                    onClick={e => this.setState({ viewIndex: 0 })}
                >
                    <LabeledIcon 
                        Icon={() => <MdRssFeed size={32}/>}
                        labelText="channels"
                    />
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
                        <Route exact path='/' render={() => <header/>}/>
                    </Switch>
                    :<header><h2>Profiles</h2></header>
                }
                </Grid.Area>
            <Grid.Area iconRight>
                <header
                    onClick={e => this.setState({ viewIndex: 2 })}
                >
                    <LabeledIcon 
                        Icon={() => <MdGroup size={32}/>}
                        labelText="profiles"
                    />
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
                        <Route exact path='/' render={() => <main/>}/>
                    </Switch>
                    <ProfilesList
                        afterItemClick={e => this.setState({ viewIndex: 1 })}
                    />
                </SwipeableViews>
            </Grid.Area>
        </Grid.Container>
    }
}