import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background: linear-gradient(225deg, #43a047, #e8f5e9);
    height: 100%;
    width: 100%;
    padding: 10%;
`

export default () => {
    return <Container>
        <h1>Welcome to CircleChat</h1>
        <p>A realtime messaging platform</p>
    </Container>
}