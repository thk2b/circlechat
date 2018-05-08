import React from 'react'

import Form from './Form'
import LoadingBar from '../../lib/LoadingBar'
import ErrorMessage from '../../lib/ErrorMessage'

export default class LoginForm extends React.Component {
    handleSubmit(e){
        e.preventDefault()
        this.props.onSubmit()
    }
    handleChange(e, fieldName){
        const { formData, onChange } = this.props
        const { value } = e.target
        onChange({
            ...formData,
            [fieldName]: value
        })
    }
    render(){
        const { onSecondary, formData, error, loading } = this.props
        const { userId, pw } = formData
        return (
            <Form
                onSubmit={e => this.handleSubmit(e)}
            >
                <h2>Log in</h2>
                <input 
                    type="text"
                    placeholder="user id"
                    value={userId}
                    onChange={e => this.handleChange(e, 'userId')}
                />
                <input 
                    type="password"
                    placeholder="password"
                    value={pw}
                    onChange={e => this.handleChange(e, 'pw')}
                />
                <button type="submit">login</button>
                <button
                    className="text"
                    onClick={e => onSecondary()}
                >No account yet? Register</button>
                {error && <ErrorMessage message={error.message}/>}
                {loading && <LoadingBar />}
            </Form>
        )
    }
}