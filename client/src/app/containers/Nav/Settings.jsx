import React from 'react'
import { connect } from 'react-redux'
import Popover from '@thk2b/oui/lib/Popover'
import MdSettings from 'react-icons/lib/md/settings'

import Menu from '../../lib/Menu'
import LabeledIcon from '../../lib/LabeledIcon'
import { setTheme } from '../../../store/modules/theme'
import { authActions } from '../../../store/modules/auth'

const mapState = ({ device, theme }) => {
    return {
        theme: theme.active,
        themes: ['light', 'dark'],
        isMobile: device.isMobile
    }
}

const mapDispatch = dispatch => {
    return {
        onSetTheme: theme => dispatch(setTheme(theme)),
        onLogout: () => dispatch(authActions.logout())
    }
}

const Settings = ({
    theme, themes, isMobile,
    onSetTheme, onLogout
}) => {
    return <Popover
        zIndex={1}
        Component={() =>
            <LabeledIcon
                Icon={() => <MdSettings size={32}/>}
                labelText="settings"
            />
        }
        position={isMobile
            ? {top: '100%', right: 0}
            : {bottom: 0, left: '100%'}
        }
    >
        <Menu.Container>
            <h3>settings</h3>
            <Menu.Item>
                <button
                    onClick={e => onLogout()}
                >
                    logout
                </button>
            </Menu.Item>
            <Menu.Item>
                <p>theme</p>
                <select
                    onChange={({ target }) => onSetTheme(target.value)}
                    value={theme}
                >
                    {themes.map(
                        theme => <option
                            key={theme}
                            value={theme}
                        >{theme}</option>
                    )}
                </select>
            </Menu.Item>
        </Menu.Container>
    </Popover>
       
}

export default connect(mapState, mapDispatch)(Settings)