import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Grid, Resizable } from 'oui'

import { Sidebar as ChannelsSidebar } from '../Channel'
import { Sidebar as ProfilesSidebar } from '../Profile'

const mapState = ({}) => {
    return {
        
    }
}

const mapDispatch = dispatch => {
    return {

    }
}

class MobileGroup extends React.Component {
    render(){
        return 'Mobile Group'
    }
}

class DesktopGroup extends React.Component {
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
                channelsSidebar.isOpen && channelsSidebar+'px',
                '1fr',
                profilesSidebar.isOpen && profilesSidebar+'px',
            ]}
            rows={'100px 1fr'}
            areas={[
                [
                    channelsSidebar.isOpen && 'channelsSidebarHeader',
                    'channelHeader',
                    profilesSidebar.isOpen && 'profilesSidebarHeader',
                ],
                [
                    channelsSidebar.isOpen && 'channelsSidebar',
                    'channel',
                    profilesSidebar.isOpen && 'profilesSidebar',
                ]
            ]}
        >
            <Grid.Area channelsSidebarHeader>
                <ChannelsSidebarHeader
                    onCloseSidebar={e => this.toggle('channelsSidebar')}
                >
                    <h2>Channels</h2>
                </ChannelsSidebarHeader>
            </Grid.Area>
            <Grid.Area channelHeader Component={ChannelHeader}/>
            <Grid.Area profilesSidebarHeader>
                <ProfilesSidebarHeader
                    onCloseSidebar={e => this.toggle('profilesSidebar')}
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
            <Grid.Area channel Component={Channel}/>
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

const Group = ({ device, ...props }) => {
    return device.isMobile
        ? <MobileGroup {...props}/>
        : <DesktopGroup {...props} />
}