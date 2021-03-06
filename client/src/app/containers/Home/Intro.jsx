import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background: ${props => props.disableGradient
        ? '#43a047'
        : 'linear-gradient(225deg, #43a047, #00df11)'
    };
    height: 100%;
    width: 100%;
    padding: 10%;
`

export default ({ disableGradient=false }) => {
    return <Container disableGradient={disableGradient}>
        <h1>Welcome to CircleChat</h1>
        <p>A realtime messaging platform</p>
    </Container>
}