import React from 'react'
import classNames from 'classnames'

import css from './Editable.css'

export default class Editable extends React.Component {
    constructor(props){
        super(props)
        console.log(this.props)
        this.state = {
            editing: false,
            showIcon: false,
            value: this.props.value
        }
    }
    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.value !== prevProps.value){
            this.setState({ value: this.props.value })
        }
    }
    
    toggle = key => this.setState({ [key]: !this.state[key] })
    handleChange = e => this.setState({ value: e.target.value })
    handleSubmit = () => {
        this.props.onSubmit && this.props.onSubmit(this.state.value)
    }
    handleCancel = () => {
        this.setState({ value: this.props.value })
    }
    render() {
        if( this.state.editing ){
            return <div>
                <input
                    className={classNames(this.props.className)}
                    value={this.state.value}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={({ key }) => key === 'Enter' && this.handleSubmit()}
                />
                <button
                    onClick={e => this.handleSubmit()}
                >save</button>
                <button
                    onClick={e => this.handleCancel()}
                >cancel</button>
            </div>
        }
        return <div className={css.Editable}
                onClick={e => this.toggle('editing') }
                onMouseOver={e => this.toggle('showIcon') }
                onMouseLeave={e => this.toggle('showIcon') }
            >
                <this.props.as
                    className={classNames(this.props.className)}
                >
                    {this.state.value}
                    {this.state.showIcon && <small>edit</small>}
                </this.props.as>
        </div>
    }
}
