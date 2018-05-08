import styled, { keyframes } from 'styled-components'

const translate = keyframes`
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(100%);
    }
`

const pulse = keyframes`
    from {
        opacity: 0.4;
    }
    to {
        opacity: 1;
    }
`

export default styled.figure`
    background-color: #43a047;
    margin: 0;
    position: absolute;
    top: 0;
    height: 5px;
    left: -100%;
    right: 100%;
    animation: 
        ${translate} .5s ease-in,
        ${pulse} .5s linear .5s infinite alternate
    ;
    animation-fill-mode: forwards;
`