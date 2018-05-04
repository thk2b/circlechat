import React from 'react'
import styled from 'styled-components'
import MdDelete from 'react-icons/lib/md/delete'
import MdEdit from 'react-icons/lib/md/edit'

const H1 = styled.h1`
    display: inline-block;
`

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

        if(editing) return <div>
            <input type="text"
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
            <H1
            >{name}</H1>
            {showIcon && <MdEdit onClick={e => this.handleStartEdit() }/>}
        </div>
    }
}