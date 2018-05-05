import React from 'react'
import styled from 'styled-components'
import MdDelete from 'react-icons/lib/md/delete'
import MdEdit from 'react-icons/lib/md/edit'

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
        this.setState({ editing: true, editingValue: this.props.description })
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
        const { description } = this.props
        const { editing, editingValue, showIcon } = this.state

        if(editing) return <div>
            <textarea
                value={editingValue}
                onChange={e => this.setState({ editingValue: e.target.value })}
            />
            <button
                onClick={e => this.handleSubmit(e)}
            >save</button>
            <button
                onClick={e => this.handleCancel(e)}
            >cancel</button>
        </div>

        return <div
            onMouseOver={ e => this.handleMouseOver(e)}
            onMouseLeave={ e => this.handleMouseLeave(e)}
        >
            <p>About</p>
            <p>{description||'no description yet'}</p>
            {showIcon && <MdEdit onClick={e => this.handleStartEdit() }/>}
        </div>
    }
}