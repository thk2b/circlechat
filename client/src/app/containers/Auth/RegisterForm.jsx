import React from 'react'

import Form from './Form'
import LoadingBar from '../../lib/LoadingBar'
import ErrorMessage from '../../lib/ErrorMessage'

export default class RegisterForm extends React.Component {
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
        const { userId, email, pw } = formData
        return (
            <Form
                onSubmit={e => this.handleSubmit(e)}
            >
                <h2>Register</h2>
                <input 
                    type="text"
                    placeholder="user id"
                    value={userId}
                    onChange={e => this.handleChange(e, 'userId')}
                />
                <input 
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={e => this.handleChange(e, 'email')}
                />
                <input 
                    type="password"
                    placeholder="password"
                    value={pw}
                    onChange={e => this.handleChange(e, 'pw')}
                />
                <button type="submit">register</button>
                <button
                    className="text"
                    onClick={e => onSecondary()}
                >Already have an account? Login</button>
                {error && <ErrorMessage message={error.message}/>}
                {loading && <LoadingBar />}
            </Form>
        )
    }
}