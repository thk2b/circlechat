import React from 'react'

export default class RegisterForm extends React.Component {
    handleSubmit(e){
        e.preventDefault()
        this.props.onSubmit()
    }
    handleChange(e, fieldName){
        const { formData, onChange } = this.props
        const { value } = e.target
        if(value){
            onChange({
                ...formData,
                [fieldName]: value
            })
        }
    }
    render(){
        const { onSecondary, formData, error, loading } = this.props
        const { userId, email, pw } = formData
        return (
            <form
                onSubmit={e => this.handleSubmit(e)}
            >
                <input 
                    type="text"
                    value={userId}
                    onChange={e => this.handleChange(e, 'userId')}
                />
                <input 
                    type="text"
                    value={email}
                    onChange={e => this.handleChange(e, 'email')}
                />
                <input 
                    type="password"
                    value={pw}
                    onChange={e => this.handleChange(e, 'pw')}
                />
                <button type="submit">register</button>
                <button onClick={e => onSecondary()}>login</button>
                {error && <p>{error.message}</p>}
                {loading && <p>loading...</p>}
            </form>
        )
    }
}