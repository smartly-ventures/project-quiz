import React from 'react'
import styled from 'styled-components'

const Create = () => {
  return (
    <Wrapper>
      <TextPrimary style={{ margin: "50px 0 10px 0" }} >Create Quiz</TextPrimary>
    </Wrapper>
  )
}

export default Create

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
`

const TextPrimary = styled.span`
  text-align: center;
  color: white;
  font-size: 24px;
  font-weight: 600;
  width: 90%;
`