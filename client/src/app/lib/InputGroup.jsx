import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    align-items: stretch;

    & input {
        flex: 1!important ;
        border-top-right-radius: 0!important ;
        border-bottom-right-radius: 0!important ;
    }
    & button {
        border-radius: 0 !important ;
    }
    & button:last-of-type{
        border-top-right-radius: 3px !important ;
        border-bottom-right-radius: 3px !important ;
    }
`

export default ({ children }) => (
    <Container>
        {children}
    </Container>
)