import { useEffect, useState } from 'react'

import styled from "styled-components"
import { useAccount } from 'wagmi'
import { Analytics } from '@vercel/analytics/react';

import bgCircle1 from "./assets/bg-circle-1.svg"
import bgCircle2 from "./assets/bg-circle-2.svg"

import Onboarding from './flows/Onboarding';
import Main from './flows/Main';

function App() {

  const { address, isConnected } = useAccount()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker &&
        navigator.serviceWorker.register("/sw.js")
          .then(function (registration) {
            console.log("Excellent, registered with scope: ", registration.scope);
          });
    }
  }, [navigator])


  return (
    <Wrapper>
      <BGCircle style={{ top: 0, right: 0 }} src={bgCircle1} />
      {
        isConnected ? <Main /> : <Onboarding />
      }
      <BGCircle style={{ bottom: 0, left: 0 }} src={bgCircle2} />
      <Analytics />
    </Wrapper>
  )
}

export default App

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #6A5AE0;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow-x: hidden;
`

const BGCircle = styled.img`
  position: fixed;
  height: 40%;
`