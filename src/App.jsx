import { useEffect, useState } from 'react'

import styled from "styled-components"
import CryptoJS from 'crypto-js'
import OpenAI from "openai";
import { useAccount } from 'wagmi'

import bgCircle1 from "./assets/bg-circle-1.svg"
import bgCircle2 from "./assets/bg-circle-2.svg"

import Onboarding from './flows/Onboarding';
import Main from './flows/Main';

function App() {

  const [quiz, setQuiz] = useState([{ question: "", options: { 1: "", 2: "", 3: "", 4: "", }, correctOption: "", pointsIfCorrenct: "" }])

  const encryptQuiz = (decryptedQuiz) => {
    return CryptoJS.AES.encrypt(JSON.stringify(decryptedQuiz), import.meta.env.VITE_AES_SECRET_KEY).toString();
  }
  const decryptQuiz = (encryptedQuiz) => {
    var bytes = CryptoJS.AES.decrypt(encryptedQuiz, import.meta.env.VITE_AES_SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const getQuiz = async (numberOfQuestion, topic, level,) => {
    setQuiz(await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: `respond only in code and strictly dont include any other supporting text in your response with a ${numberOfQuestion} unique, new and random questions with 4 options quiz on topic ${topic} of ${level} level with different pointsIfCorrenct for each question depending on level of difficulty but with total for all questions equal to 100 in an array of objects format only, strictly use the below scema only: 
      [ { question: "", options: { 1: "", 2: "", 3: "", 4: "", }, correctOption: "", pointsIfCorrenct: "" } ]`,
      temperature: 1,
    }))
  }

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
`

const BGCircle = styled.img`
  position: absolute;
  height: 40%;
`