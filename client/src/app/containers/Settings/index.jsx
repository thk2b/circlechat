import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import MdSettings from 'react-icons/lib/md/settings'

import { logout } from '../../../store/modules/auth'
import css from './Settings.css'

const mapDispatch = dispatch => bindActionCreators({ logout }, dispatch)

class Settings extends React.Component {
    constructor(props){
        super(props)
        this.state = { open: false }
    }
    render() {
        const { open } = this.state
        const { logout } = this.props
        return <div
            className={css.SettingsIcon}
            role="button"
            aria-pressed={this.state.open}
        >
            <MdSettings onClick={e => {
                this.setState({ open: !open })
            }}/>
            {open && <div className={css.SettingsTooltip}>
                <button
                    className={css.SettingsTooltipButton}
                    onClick={_=> logout()}
                    >logout
                </button>
            </div>}
        </div>
    }
}

export default connect(undefined, mapDispatch)(Settings)