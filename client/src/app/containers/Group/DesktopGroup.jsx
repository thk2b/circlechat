import React from 'react'
import Grid from '@thk2b/oui/lib/Grid'
import Resizable from '@thk2b/oui/lib/Resizable'
import { Route, Switch } from 'react-router'
import MdChevronLeft from 'react-icons/lib/md/chevron-left'
import MdChevronRight from 'react-icons/lib/md/chevron-right'

import SidebarHeader from '../../lib/SidebarHeader'
import LabeledIcon from '../../lib/LabeledIcon'
import Nav from '../Nav'
import Logo from '../Logo'
import Profile, {
    ProfilesList,
    ProfileHeader
} from '../Profile'
import Channel, {
    ChannelsList,
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
            isOpen: !this.state[sidebarName].isOpen
        }})
    }
    render(){
        const { profilesSidebar, channelsSidebar } = this.state

        return <Grid.Dynamic
            columns={[
                '80px',
                channelsSidebar.isOpen ? channelsSidebar.width+'px' : '80px',
                '1fr',
                profilesSidebar.isOpen ? profilesSidebar.width+'px': '80px',
            ]}
            rows={'80px 1fr'}
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
            <Grid.Area logo Component={Logo}/>
            <Grid.Area nav Component={Nav}/>
            <Grid.Area channelsSidebarHeader>
                <SidebarHeader
                    onClose={e => this.toggle('channelsSidebar')}
                    onOpen={e => this.toggle('channelsSidebar')}
                    isOpen={channelsSidebar.isOpen}
                    OpenComponent={<LabeledIcon
                        Icon={() => <MdChevronRight size={32}/>}
                        labelText="channels"
                    />}
                >
                    <h2>Channels</h2>
                </SidebarHeader>
            </Grid.Area>
            <Grid.Area contentHeader>
                <Switch>
                    <Route path='/channel/create'><header><h2>New Channel</h2></header></Route>
                    <Route path='/channel/:id' component={ChannelHeader}/>
                    <Route path='/profile/:id' component={ProfileHeader}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => <header />}/>
                </Switch>
            </Grid.Area>
            <Grid.Area profilesSidebarHeader>
                <SidebarHeader
                    onClose={e => this.toggle('profilesSidebar')}
                    onOpen={e => this.toggle('profilesSidebar')}
                    isOpen={profilesSidebar.isOpen}
                    OpenComponent={<LabeledIcon
                        Icon={() => <MdChevronLeft size={32}/>}
                        labelText="profiles"
                    />}
                >
                    <h2>Profiles</h2>
                </SidebarHeader>
            </Grid.Area>

            {channelsSidebar.isOpen && <Grid.Area channelsSidebar
                style={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
                <Resizable right
                    width={{ min: 100, max: 300 }}
                    onResize={({ width }) => this.resize('channelsSidebar', width)}
                >
                    <ChannelsList />
                </Resizable>
            </Grid.Area>}
            <Grid.Area content style={{ overflow: 'hidden' }}>
                <Switch>
                    <Route path='/channel/create' component={CreateChannel}/>
                    <Route path='/channel/:id' component={Channel}/>
                    <Route path='/profile/:id' component={Profile}/>
                    <Route path='/me' component={Profile}/>
                    <Route exact path='/' render={() => <main/>}/>
                </Switch>
            </Grid.Area>
            {profilesSidebar.isOpen && <Grid.Area profilesSidebar
                style={{ overflowY: 'auto', overflowX: 'hidden' }}
            >
                <Resizable left
                    width={{ min: 100, max: 300 }}
                    onResize={({ width }) => this.resize('profilesSidebar', width)}
                >
                    <ProfilesList />
                </Resizable>
            </Grid.Area>}
        </Grid.Dynamic>
    }
}