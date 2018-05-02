import React from 'react'
import Grid from '@thk2b/oui/lib/Grid'
import Resizable from '@thk2b/oui/lib/Resizable'
import { Route, Switch } from 'react-router'

import Nav from '../Nav'
import Profile, {
    ProfilesSidebar,
    ProfilesSidebarHeader,
    ProfileHeader
} from '../Profile'
import Channel, {
    ChannelsSidebar,
    ChannelsSidebarHeader,
    ChannelHeader,
    CreateChannel
} from '../Channel'

export default class DesktopGroup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            profilesSidebar: {
                isOpen: true,
                width: 200
            },
            channelsSidebar: {
                isOpen: true,
                width: 200
            }
        }
    }
    resize(sidebarName, width){
        this.setState({ [sidebarName]: {
            ...this.state[sidebarName],
            width
        }})
    }
    toggle(sidebarName){
        this.setState({ [sidebarName]: {
            ...this.state[sidebarName],
            open: !this.state[sidebarName].open
        }})
    }
    render(){
        const { channels, profiles } = this.props
        const { profilesSidebar, channelsSidebar } = this.state

        return <Grid.Dynamic
            columns={[
                '100px',
                channelsSidebar.isOpen ? channelsSidebar+'px' : '100px',
                '1fr',
                profilesSidebar.isOpen ? profilesSidebar+'px': '100px',
            ]}
            rows={'100px 1fr'}
            areas={[
                [
                    'logo',
                    'channelsSidebarHeader',
                    'contentHeader',
                    'profilesSidebarHeader',
                ],
                [
                    'nav',
                    channelsSidebar.isOpen ? 'channelsSidebar' : 'content',
                    'content',
                    profilesSidebar.isOpen ? 'profilesSidebar' : 'content',
                ]
            ]}
        >
            <Grid.Area logo><h1>CC</h1></Grid.Area>
            <Grid.Area nav Component={Nav}/>
            <Grid.Area channelsSidebarHeader>
                <ChannelsSidebarHeader
                    onClose={e => this.toggle('channelsSidebar')}
                >
                    <h2>Channels</h2>
                </ChannelsSidebarHeader>
            </Grid.Area>
            <Grid.Area contentHeader>
                <Switch>
                    <Route path='/channel/create'>New Channel</Route>
                    <Route path='/channel/:id' component={ChannelHeader}/>
                    <Route path='/profile/:id' component={ProfileHeader}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => 'Group content goes here'}/>
                </Switch>
            </Grid.Area>
            <Grid.Area profilesSidebarHeader>
                <ProfilesSidebarHeader
                    onClose={e => this.toggle('profilesSidebar')}
                >
                    <h2>Profiles</h2>
                </ProfilesSidebarHeader>
            </Grid.Area>

            {channelsSidebar.isOpen && <Grid.Area channelsSidebar>
                <Resizable right
                    width={{ min: 50 }}
                    onResize={({ width }) => this.resize('channelsSidebar', width)}
                >
                    <ChannelsSidebar />
                </Resizable>
            </Grid.Area>}
            <Grid.Area content>
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => 'Group content goes here'}/>
                </Switch>
            </Grid.Area>
            {profilesSidebar.isOpen && <Grid.Area profilesSidebar>
                <Resizable left
                    width={{ min: 50 }}
                    onResize={({ width }) => this.resize('profilesSidebar', width)}
                >
                    <ProfilesSidebar />
                </Resizable>
            </Grid.Area>}
        </Grid.Dynamic>
    }
}