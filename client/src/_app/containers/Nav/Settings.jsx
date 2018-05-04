import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Popover from '@thk2b/oui/lib/Popover'
import MdSettings from 'react-icons/lib/md/settings'

import { setTheme } from '../../../store/modules/theme'

const mapState = ({ theme }) => {
    return {
        theme: theme.active,
        themes: ['light', 'dark']
    }
}

const mapDispatch = dispatch => {
    return {
        setTheme: theme => dispatch(setTheme(theme))
    }
}

const MenuContainer= styled.aside`
    z-index: 100;
    width: 250px;
    & h3 {
        text-align: center;
        padding: 10px;
    }
    & span:not(:first-of-type) {
        border-top: 1px solid black
    }
`

const MenuItemContainer = styled.span`
    padding: 10px;
    display: flex;
    justify-content: space-around;
`

const Settings = ({ theme, themes, setTheme }) => {
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
                <p>theme</p>
                <select
                    onChange={({ target }) => setTheme(target.value)}
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