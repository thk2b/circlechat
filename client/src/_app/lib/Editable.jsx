import React from 'react'
import styled from 'styled-components'
import MdDelete from 'react-icons/lib/md/delete'
import MdEdit from 'react-icons/lib/md/edit'

const Container = styled.div`
    display: inline-block;
`

export default class Editable extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showIcons: false,
            value: this.props.value,
            isEditing: false
        }
        this.initialValue = this.props.value
    }
    handleChange(e){
        this.setState({ value: e.target.value })
    }
    handleSumbmit(e){
        this.props.onSubmit(this.state.value)
        this.setState({ isEditing: false })
    }
    handleCancel(e){
        this.setState({ isEditing: false })
    }
    handleStartEditing(){
        this.initialValue = this.state.value
    }
    handleMouseOver(){
        if(!this.state.isEditing){
            this.setState({
                showIcons: true
            })
        }
    }
    handleMouseLeave(){
        if(this.state.showIcons){
            this.setState({
                showIcons: false
            })
        }
    }
    componentDidUpdate(prevProps, prevState){
        if(prevProps.value !== this.props.value){
            this.initialValue = this.props.value
            this.setState({ value: this.props.value })
        }
    }
    renderIcons(){
        const EditIcon = <MdEdit key={'edit'}
            onClick={e => this.handleStartEditing(e)}
        />
        if(this.props.onDelete){
            return [
                <MdDelete key={'delete'}
                    onClick={e => this.props.onDelete(e)}
                />,
                EditIcon
            ]
        }
        return EditIcon
    }
    render(){
        const { Component, EditingComponent, onSubmit, onDelete } = this.props
        const { isEditing, showIcons, value } = this.state

        if(isEditing){
            return <div>
                <EditingComponent
                    value={value}
                    onChange={e => this.handleChange(e)}
                    onKeyDown={e => e.key === 'Enter' && this.handleSubmit(e)}
                />
                <button onClick={e => this.handleStartEditing(e)}>save</button>
                <button onClick={e => this.handleCancel(e)}>cancel</button>
            </div>
        }

        return <Container
            onMouseOver={e => this.handleMouseOver()}
            onMouseLeave={e => this.handleMouseLeave()}
        >
            {showIcons && this.renderIcons()}
            <Component value={value} />
        </Container>
    }
}