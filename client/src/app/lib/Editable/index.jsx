import React from 'react'
import classNames from 'classnames'
import MdModeEdit from 'react-icons/lib/md/mode-edit'
import MdCheck from 'react-icons/lib/md/check'
import MdClear from 'react-icons/lib/md/clear'


import Button from '../Button'
import ButtonGroup from '../ButtonGroup'
import InputWithButtons from '../InputWithButtons'

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
    set = key => value => this.setState({ [key]: value })
    toggle = key => this.setState({ [key]: !this.state[key] })

    componentDidUpdate = (prevProps, prevState) => {
        if(this.props.value !== prevProps.value){
            this.setState({ value: this.props.value })
        }
        if(!prevState.editing && this.state.editing){
            this.$input.focus()
            this.$input.select()
        }
    }

    handleChange = e => this.setState({ value: e.target.value })
    submit = () => {
        this.setState({ editing: false, showIcon: false })
        this.props.onSubmit && this.props.onSubmit(this.state.value)
    }
    cancel = () => {
        this.setState({ value: this.props.value, editing: false, showIcon: false })
    }

    render() {
        if( this.state.editing ){
            const Tag = this.props.isTextarea? 'textarea':'input'
            return <InputWithButtons>
                <Tag
                    className={classNames(this.props.className)}
                    value={this.state.value}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={({ key }) => key === 'Enter' && this.submit()}
                    ref={i => this.$input = i}
                />
                <button onClick={e => this.submit()}>
                    <MdCheck />
                </button>
                <button onClick={e => this.cancel()}>
                    <MdClear />
                </button>
            </InputWithButtons>
        }
        return <div className={css.Editable}
                onClick={e => this.toggle('editing') }
                onMouseOver={e => this.toggle('showIcon') }
                onMouseLeave={e => this.toggle('showIcon') }
            >
                <this.props.as
                    className={classNames(this.props.className)}
                >
                    {this.props.value}
                    {this.state.showIcon && <MdModeEdit/>}
                </this.props.as>
        </div>
    }
}
