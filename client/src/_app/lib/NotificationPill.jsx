import React from 'react'
import styled from 'styled-components'

const Span = styled.span`
    background-color: #2847f5;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    font-size: 16px;
    text-align: center;
`

export default ({ count, hasMore }) => {
    if(!count) return null
    return <Span>
        <p>{count}</p>
    </Span>
}