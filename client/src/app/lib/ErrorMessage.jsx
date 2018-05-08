import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    background-color: #fa5d5d;
    padding: 15px;
    border-radius: 3px;
    
`

export default ({ message }) => {
    return <Container>
        <p>{message}</p>
    </Container>
}