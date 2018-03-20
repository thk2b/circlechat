import React from 'react'
import classNames from 'classnames'

import IconButton from 'material-ui/IconButton'
import TextField from 'material-ui/TextField'
import CheckIcon from 'material-ui/svg-icons/action/done'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import EditIcon from 'material-ui/svg-icons/image/edit'
import DeleteIcon from 'material-ui/svg-icons/action/delete-forever'

import css from './Editable.css'

export default class Editable extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editing: false,
            showIcon: false,
            value: this.props.value
        }
    }
    set = (key, value) => {
        if(this.state[key] === value) return
        this.setState({ [key]: value })
    }

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
            return <div className={css.Editable}>
                <TextField
                    name="editable-field"
                    value={this.state.value}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={({ key }) => !this.props.isTextarea && key === 'Enter' && this.submit()}
                    ref={i => this.$input = i}
                    multiLine={this.props.isTextarea || false}
                    style={{width: 'auto'}}
                />
                <IconButton
                    tooltip="save"
                    onClick={e => this.submit()}
                >
                    <CheckIcon />
                </IconButton>
                <IconButton
                    tooltip="cancel"
                    onClick={e => this.cancel()}
                >
                    <ClearIcon />
                </IconButton>
            </div>
        }
        return <div
                className={css.Editable}
                onMouseOver={e => this.set('showIcon', true) }
                onMouseLeave={e => this.set('showIcon', false) }
            >
                {this.props.children}
                {this.state.showIcon && <IconButton
                    onClick={e => this.toggle('editing')}
                    tooltip="edit"
                >
                    <EditIcon/>
                </IconButton>}
                {this.state.showIcon && this.props.isDeletable && <IconButton
                    onClick={e => this.props.onDelete()}
                    tooltip="delete"
                >
                    <DeleteIcon/>
                </IconButton>}
        </div>
    }
}
