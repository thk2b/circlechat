import React from 'react'

export default class LoginForm extends React.Component {
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
        const { userId, pw } = formData
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
                    type="password"
                    value={pw}
                    onChange={e => this.handleChange(e, 'pw')}
                />
                <button type="submit">login</button>
                <button onClick={e => onSecondary()}>register</button>
                {error && <p>{error.message}</p>}
                {loading && <p>loading...</p>}
            </form>
        )
    }
}