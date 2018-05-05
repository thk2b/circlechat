import React from 'react'
import styled from 'styled-components'

export default styled.form`
    display: flex;
    flex-flow: column nowrap;
    max-width: 350px;
    margin: 0 auto;
    & input, button, h2 {
        padding: 5px;
        margin: 5px;
    }
    & input {
        flex: 1;
    }
    & button {
        max-width: 50%;
    }
    & button.text {
        max-width: 100%;
    }
`