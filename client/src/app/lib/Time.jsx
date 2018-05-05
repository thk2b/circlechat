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
            this.interval = setInterval(() => {
                this.update()
            }, this.props.updateInterval)
        }
    }

    componentWillUnmount = () => {
        clearInterval(this.interval)
    }
    
    update(){
        this.setState({ elapsed: getElapsed(this.props.since) })
    }

    render(){
        let { elapsed } = this.state
        
        if( elapsed > 60 * 1000) return `${ms(elapsed, { long: true })} ago`
        return 'just now'
    }
}