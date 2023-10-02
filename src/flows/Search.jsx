import React, { useState } from 'react'
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast';

import quizBG from "../assets/quiz-top-bg.svg"

const Search = () => {

  const [quiz, setQuiz] = useState({ quizTitle: "Blockchain Quiz", quizDescription: "Play this blockchain quiz to prove you are the og!", questions: [] })
  const [titleText, setTitleText] = useState("Search Quiz")
  const [quizAddress, setQuizAddress] = useState("")
  const [quizFound, setQuizFound] = useState(false)

  const decryptQuiz = (encryptedQuiz) => {
    var bytes = CryptoJS.AES.decrypt(encryptedQuiz, import.meta.env.VITE_AES_SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  const findQuiz = () => {
    if (quizAddress != "0xCE4f3a2b9e04d8F59d08A1Ce9F54dD0Af5Eda8ac") {
      toast.error('Quiz Not Found');
    } else {
      toast.success('Quiz Found!')
      setTitleText("")
      setQuizFound(true)
    }
  }

  return (
    <Wrapper>
      <TextPrimary style={{ margin: "50px 0 10px 0" }} >{titleText}</TextPrimary>

      {
        quizFound == false ?
          <>
            <TopBG src={quizBG} />
            <QuizDiv>
              <Label>Search For Your Quiz</Label>
              <Input placeholder='Enter The Quiz Address...' onChange={(e) => { setQuizAddress(e.target.value) }} />
              <Button type='reset' onClick={findQuiz} >Search</Button>
            </QuizDiv>
          </> :
          <>
            <TopBG src={quizBG} />
            <QuizDiv>
              <Label style={{ fontSize: "12px", color: "#858494" }} >Quiz Title</Label>
              <Label style={{ fontSize: "18px", marginTop: "0px", fontWeight: "600" }} >{quiz.quizTitle}</Label>
              <Label style={{ fontSize: "12px", color: "#858494" }} >Description</Label>
              <Label style={{ fontSize: "14px", marginTop: "0px", fontWeight: "400" }} >{quiz.quizDescription}</Label>
              <Label style={{ fontSize: "12px", color: "#858494" }} >Creator</Label>
              <Label style={{ fontSize: "14px", marginTop: "0px", fontWeight: "400" }} >{"0xCE4f3a2b9e04d8F59d08A1Ce9F54dD0Af5Eda8ac"}</Label>
              <Button type='reset' >Play Quiz</Button>
            </QuizDiv>
          </>
      }

      <Toaster position="top-right" />
    </Wrapper>
  )
}

export default Search

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

const QuizDiv = styled.form`
  width: 90%;
  max-width: 500px;

  padding: 20px;
  border-radius: 18px;
  margin-top: 15px;

  background-color: #EFEEFC;
  color: black;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Label = styled.span`
    color: #000000;
    font-size: 14px;
    font-weight: 500;
    margin-top: 15px;
    outline: none;
    width: 90%;
    text-align: left;
`

const Input = styled.input`
    color: #858494;
    background: #FFFFFF;
    border: 2px solid #C4D0FB;
    border-radius: 18px;
    font-size: 12px;
    font-weight: 500;
    padding: 15px;
    margin: 5px 0;
    outline: none;
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

const Button = styled.button`
    color: #FFFFFF;
    background: #6A5AE0;
    border-radius: 18px;
    font-size: 16px;
    font-weight: 500;
    padding: 15px;
    white-space: nowrap;
    margin: 20px 0 10px 0;
    width: 90%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const TopBG = styled.img`
  width: 90%;
  max-width: 450px;
  margin: 50px 0 -20px 0;
`