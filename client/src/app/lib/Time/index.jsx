import React from 'react'
import ms from 'ms'

const getElapsed = time => Date.now() - time

export default class Time extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            elapsed: getElapsed(this.props.since)
        }
        if(this.props.updateInterval){
            setInterval(() => this.update(), this.props.updateInterval)
        }
    }

    update = () => this.setState({ elapsed: getElapsed(this.props.since) })

    render(){
        return `${ms(this.state.elapsed, { long: true })} ago`
    }
}