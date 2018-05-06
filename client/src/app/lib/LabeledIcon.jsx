import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    text-align: center;
    & label {
        display: block;
        font-size: 12px;
        text-transform: uppercase;
    }
`

export default ({ Icon, labelText, ...props }) => {
    return <Container {...props}>
        <Icon />
        <label>{labelText}</label>
    </Container>
}