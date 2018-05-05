import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background: linear-gradient(blue, lightblue);
    height: 100%;
    width: 100%;
    padding: 10%;
`

export default ({}) => {
    return <Container>
        <h1>Welcome to CircleChat</h1>
        <p>A realtime messaging platform</p>
    </Container>
}