import styled from 'styled-components'

const Container = styled.aside`
    z-index: 100;
    width: 250px;
    & h3 {
        text-align: center;
        padding: 10px;
    }
    & span {
        border-top: 1px solid black
    }
`

const Item = styled.span`
    padding: 10px;
    display: flex;
    justify-content: space-around;
`

export default { Container, Item }