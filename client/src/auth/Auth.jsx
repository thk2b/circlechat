import React from 'react'
import { connect } from 'react-redux'

import { Input, Button } from '../lib/components'

import css from './Auth.css'

class Auth extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
    render() {
        return (
        <div className={css.Auth}>
            <form className={css.form}>
                <h1>Log in</h1>
                <Input placeholder="id or email"/>
                <Input placeholder="password"/>
                <Button>Log in</ Button>
                <Button underlined>Register</ Button>
            </form>
        </div>
    )
  }
}

const mapState = state => {
    return {}
}

const mapDispatch = dispatch => {
    return {}
}

export default connect(mapState, mapDispatch)(Auth)
