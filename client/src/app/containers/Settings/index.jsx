import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import SettingsIcon from 'material-ui/svg-icons/action/settings'

import Popover from 'material-ui/Popover'
import { Menu, MenuItem } from 'material-ui/Menu'
import IconButton from 'material-ui/IconButton'

import { logout } from '../../../store/modules/auth'
import { SelectTheme } from '../'

const mapDispatch = dispatch => bindActionCreators({ logout }, dispatch)

class Settings extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            open: false
        }
        this.anchorEl = null
    }
    handleClick(e){
        e.preventDefault()
        this.setState({ open: true })
        this.anchorEl = e.currentTarget
    }
    handleRequestClose(){
        this.setState({ open: false })
    }
    render() {
        const { open } = this.state
        const { logout } = this.props
        return <React.Fragment>
            <IconButton
                onClick={e => this.handleClick(e)}
            >
                <SettingsIcon/>
            </IconButton>
            <Popover
                open={open}
                anchorEl={this.anchorEl}
                onRequestClose={() => this.handleRequestClose()}
            >
                <Menu>
                    <MenuItem onClick={ () => logout()}>
                        Logout
                    </MenuItem>
                    <MenuItem>
                        <SelectTheme />
                    </MenuItem>
                </Menu>
            </Popover>
        </React.Fragment>
    }
}

export default connect(undefined, mapDispatch)(Settings)