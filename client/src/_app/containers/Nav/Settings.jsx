import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Popover from '@thk2b/oui/lib/Popover'
import MdSettings from 'react-icons/lib/md/settings'

import { setTheme } from '../../../store/modules/theme'
import { authActions } from '../../../store/modules/auth'

const mapState = ({ theme }) => {
    return {
        theme: theme.active,
        themes: ['light', 'dark']
    }
}

const mapDispatch = dispatch => {
    return {
        onSetTheme: theme => dispatch(setTheme(theme)),
        onLogout: () => dispatch(authActions.logout())
    }
}

const MenuContainer= styled.aside`
    z-index: 100;
    width: 250px;
    & h3 {
        text-align: center;
        padding: 10px;
    }
    & span {
        border-top: 1px solid black
    }
`

const MenuItemContainer = styled.span`
    padding: 10px;
    display: flex;
    justify-content: space-around;
`

const Settings = ({
    theme, themes, onSetTheme,
    onLogout
}) => {
    return <Popover
        zIndex={1}
        Component={() =>
            <MdSettings
                width='100%'
                size={32}
                color='#d9d9d9'
            />
        }
        position={{bottom: 0, left: '100%'}}
    >
        <MenuContainer>
            <h3>settings</h3>
            <MenuItemContainer>
                <button
                    onClick={e => onLogout()}
                >
                    logout
                </button>
            </MenuItemContainer>
            <MenuItemContainer>
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
            </MenuItemContainer>
        </MenuContainer>
    </Popover>
       
}

export default connect(mapState, mapDispatch)(Settings)