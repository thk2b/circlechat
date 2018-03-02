import React from 'react'
import classNames from 'classnames'
import MdModeEdit from 'react-icons/lib/md/mode-edit'

import Button from '../Button'
import ButtonGroup from '../ButtonGroup'

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
    handleSubmit = () => {
        this.setState({ editing: false, showIcon: false })
        this.props.onSubmit && this.props.onSubmit(this.state.value)
    }
    handleCancel = () => {
        this.setState({ value: this.props.value, editing: false, showIcon: false })
    }

    render() {
        if( this.state.editing ){
            const Tag = this.props.isTextarea? 'textarea':'input'
            return <div>
                <Tag
                    className={classNames(this.props.className)}
                    value={this.state.value}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={({ key }) => key === 'Enter' && this.handleSubmit()}
                    ref={i => this.$input = i}
                />
                <ButtonGroup maxWidth='200'>
                    <Button
                        onClick={e => this.handleSubmit()}
                    >save</Button>
                    <Button underlined
                        onClick={e => this.handleCancel()}
                    >cancel</Button>
                </ButtonGroup>
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
                    {this.props.value}
                    {this.state.showIcon && <MdModeEdit/>}
                </this.props.as>
        </div>
    }
}
