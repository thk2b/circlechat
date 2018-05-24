import React from 'react'
import styled from 'styled-components'
import MdEdit from 'react-icons/lib/md/edit'
import MdCheck from 'react-icons/lib/md/check'
import MdClose from 'react-icons/lib/md/close'

import InputGroup from '../../../lib/InputGroup'

export default class extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            editing: false,
            editingValue: '',
            showIcon: false
        }
    }
    handleCancel(){
        this.setState({ editing: false })
    }
    handleSubmit(){
        this.props.onSubmit(this.state.editingValue)
        this.setState({ editing: false })
    }
    handleStartEdit(){
        this.setState({ editing: true, editingValue: this.props.name })
    }
    handleMouseOver(){
        if(!this.state.editing){
            this.setState({ showIcon: true })
        }
    }
    handleMouseLeave(){
        if(this.state.showIcon){
            this.setState({ showIcon: false })
        }
    }
    render(){
        const { name } = this.props
        const { editing, editingValue, showIcon } = this.state

        if(editing) return <InputGroup>
            <input type="text"
                value={editingValue}
                onChange={e => this.setState({ editingValue: e.target.value })}
            />
            <button
                onClick={e => this.handleSubmit(e)}
            ><MdCheck size={22}/></button>
            <button
                onClick={e => this.handleCancel(e)}
            ><MdClose size={22}/></button>
        </InputGroup>

        return <h1
                onClick={e => this.handleStartEdit() }
                onMouseOver={ e => this.handleMouseOver(e)}
                onMouseLeave={ e => this.handleMouseLeave(e)}
            >
                {name}
                {showIcon&&<MdEdit size={22}/>}            
            </h1>
    }
}