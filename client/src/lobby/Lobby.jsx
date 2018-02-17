import { Auth } from '../auth'

import React from 'react'

import css from './Lobby.css'

export default () => {
  return (
    <div className={css.Lobby}>
        <Auth />
        <div className={css.LobbyContent}>
            <h1>Welcome to Circlechat!</h1>
            <p>A realtime media platform</p>
        </div>
    </div>
  )
}