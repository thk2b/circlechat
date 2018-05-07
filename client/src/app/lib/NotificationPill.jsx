import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
    background-color: #43a047;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    font-size: 16px;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
`

export default ({ count, hasMore }) => {
    if(!count) return null
    return <Span>
        <p>{count}</p>
    </Span>
}