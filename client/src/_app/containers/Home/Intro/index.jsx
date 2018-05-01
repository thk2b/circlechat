import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background: linear-gradient(green, blue);
`

export default ({}) => {
    return <Container>
        <h1>Welcome to CircleChat</h1>
        <p>A realtime messaging platform</p>
    </Container>
}