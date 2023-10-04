import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import toast, { Toaster } from 'react-hot-toast';
import { ethers } from 'ethers';
import JSConfetti from 'js-confetti'
import CryptoJS from 'crypto-js'
import axios from 'axios';
import { useAccount } from 'wagmi';

import quizABI from "../abi/quiz.json"

import quizBG from "../assets/quiz-top-bg.svg"

const Search = () => {

  const { address } = useAccount()
  const [quiz, setQuiz] = useState({ quizTitle: "Blockchain Quiz", quizDescription: "Play this blockchain quiz to prove you are the og!", questions: [] })
  const [titleText, setTitleText] = useState("Search Quiz")
  const [quizAddress, setQuizAddress] = useState("")
  const [quizFound, setQuizFound] = useState(false)
  const [playQuiz, setPlayQuiz] = useState(false)
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [creator, setCreator] = useState("")
  const [betAmount, setBetAmount] = useState(0)
  const [betPaid, setBetPaid] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [optionSelected, setOptionSelected] = useState(0)
  const [answersByPlayer, setAnswersByPlayer] = useState([])

  const QuizABI = quizABI.output.abi;
  const findQuiz = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider =
          new ethers.providers.Web3Provider(
            ethereum,
          );
        const signer = provider.getSigner();
        const quizContract =
          new ethers.Contract(
            quizAddress,
            QuizABI,
            signer,
          );

        const tempQuiz = decryptQuiz(await quizContract.questions());
        setQuiz(tempQuiz)

        console.log(tempQuiz)
        if (tempQuiz.questions.length > 0) {
          toast.success('Quiz Found!')
          setTitleText("Quiz Found")
          setQuizFound(true)
        } else {
          toast.error("Quiz Has No Questions")
        }

        setBetAmount(Number(await quizContract.perPersonBet()))
        setBetPaid(await quizContract.hasPaidBet(address))
        setCreator((await quizContract.creator()))
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Quiz Not Found")
    }
  }

  const trim = (address) => {
    return address.substring(0, 8) + "..." + address.substring(35, 41)
  }

  const decryptQuiz = (encryptedQuiz) => {
    var bytes = CryptoJS.AES.decrypt(encryptedQuiz, import.meta.env.VITE_AES_SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  const [totalPoints, setTotalPoints] = useState(0)

  const submitQuiz = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider =
          new ethers.providers.Web3Provider(
            ethereum,
          );
        const signer = provider.getSigner();
        const quizContract =
          new ethers.Contract(
            quizAddress,
            QuizABI,
            signer,
          );

          let tempPoints = 0;
        for (let i = 0; i < quiz.questions.length; i++) {
          if (answersByPlayer[i] == quiz.questions[i].correctOption) {
            tempPoints += Number(quiz.questions[i].pointsIfCorrenct)
            setTotalPoints(totalPoints + Number(quiz.questions[i].pointsIfCorrenct))
          }
        }

        const submitPoints = await quizContract.submitAnswers(tempPoints);
        let res = await submitPoints.wait();
        console.log(res)

        setTitleText("Quiz Completed")
        toast.success("Answers Submitted")

        setQuizSubmitted(true)
        sendThemFlying()
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Answers Not Submitted")
    }
  }

  const payBet = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider =
          new ethers.providers.Web3Provider(
            ethereum,
          );
        const signer = provider.getSigner();
        const quizContract =
          new ethers.Contract(
            quizAddress,
            QuizABI,
            signer,
          );

        console.log(ethers.utils.formatUnits(betAmount, "wei"))
        const gasPrice = await provider.getGasPrice()
        console.log(gasPrice)
        const options = { value: ethers.utils.parseUnits(String(betAmount), 18) / (10 ** 18) }
        const payBet = await quizContract.payYourBet(options);
        let res = await payBet.wait();
        console.log(res)

        setTitleText("Play Quiz")
        toast.success("Bet Paid")

        setBetPaid(await quizContract.hasPaidBet(address))
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Bet Not Paid")
    }
  }

  const submitOption = (question, option) => {
    answersByPlayer[question] = option
    setOptionSelected(option)
  }

  const sendThemFlying = () => {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
      emojis: ['🥳', '🎉'],
      emojiSize: 100,
      confettiNumber: 30,
    })
  }

  const getID = async () => {
    const res = await axios.get(`https://api.prd.space.id/v1/getName?tld=bnb&address=0x2e552E3aD9f7446e9caB378c008315E0C26c0398`);
    console.log(res)
  }

  useEffect(() => {
    getID()
  }, [])


  const distributePrize = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider =
          new ethers.providers.Web3Provider(
            ethereum,
          );
        const signer = provider.getSigner();
        const quizContract =
          new ethers.Contract(
            quizAddress,
            QuizABI,
            signer,
          );

        const distribute = await quizContract.distributePrizes();
        let res = await distribute.wait();
        console.log(res)

        setTitleText("Prize Distributed")
        toast.success("Prize Distributed")
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Prize Not Distributed")
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
          playQuiz == false ?
            <>
              <TopBG src={quizBG} />
              <QuizDiv style={{ paddingBottom: "80px" }} >
                <Label style={{ textAlign: "center", fontSize: "14px", color: "#858494" }} >Quiz Title</Label>
                <Label style={{ textAlign: "center", fontSize: "20px", marginTop: "0px", fontWeight: "600" }} >{quiz.quizTitle}</Label>
                <Label style={{ textAlign: "center", fontSize: "14px", color: "#858494" }} >Description</Label>
                <Label style={{ textAlign: "center", fontSize: "16px", marginTop: "0px", fontWeight: "400" }} >{quiz.quizDescription}</Label>
                <Label style={{ textAlign: "center", fontSize: "14px", color: "#858494" }} >Creator</Label>
                <Label style={{ textAlign: "center", fontSize: "16px", marginTop: "0px", fontWeight: "400" }} >{trim(creator)}</Label>
                {
                  betAmount > 0 && betPaid == false ? <Button type='reset' onClick={payBet} >Pay Bet</Button> :
                    <Button type='reset' onClick={() => { setPlayQuiz(true), setTitleText("Play Quiz") }} >Play Quiz</Button>
                }
                {
                  creator == address ? <Button type='reset' style={{ marginTop: "0" }} onClick={distributePrize} >Distribute Prizes</Button> : <></>
                }

              </QuizDiv>
            </> :
            quizSubmitted == false ?
              <>
                <QuizDiv style={{ paddingBottom: "80px" }} >

                  <Row>
                    <Label style={{ color: "#858494", fontSize: "12px" }} >QUESTION {currentQuestion + 1} OF {quiz.questions.length}</Label>
                    <Points>{quiz.questions[currentQuestion].pointsIfCorrenct ?? 0} Points</Points>
                  </Row>
                  <Label style={{ fontSize: "18px", marginBottom: "10px" }} >Q: {quiz.questions[currentQuestion].question}</Label>
                  <Choices style={optionSelected == 1 ? { background: "#C4D0FB" } : {}} onClick={() => { submitOption(currentQuestion, 1) }} >{quiz.questions[currentQuestion].options[1]}</Choices>
                  <Choices style={optionSelected == 2 ? { background: "#C4D0FB" } : {}} onClick={() => { submitOption(currentQuestion, 2) }} >{quiz.questions[currentQuestion].options[2]}</Choices>
                  <Choices style={optionSelected == 3 ? { background: "#C4D0FB" } : {}} onClick={() => { submitOption(currentQuestion, 3) }} >{quiz.questions[currentQuestion].options[3]}</Choices>
                  <Choices style={optionSelected == 4 ? { background: "#C4D0FB" } : {}} onClick={() => { submitOption(currentQuestion, 4) }} >{quiz.questions[currentQuestion].options[4]}</Choices>

                  {
                    quiz.questions.length == currentQuestion + 1 ?
                      <Button type='reset' onClick={submitQuiz} >Complete Quiz</Button> :
                      <Button type="reset" onClick={setCurrentQuestion(currentQuestion + 1)} >Next Question</Button>
                  }
                </QuizDiv>
              </> :
              <>
                <TopBG src={quizBG} />
                <QuizDiv>
                  <Label style={{ textAlign: "center", fontSize: "14px", color: "#858494" }} >Quiz Completed</Label>
                  <Label style={{ textAlign: "center", fontSize: "20px", marginTop: "0px", fontWeight: "600" }} >{totalPoints} Points Won!</Label>
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

  background-color: #FFF;
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

const Points = styled.div`
  background: #FF9B57;
  color: white;
  border-radius: 8px;
  padding: 5px;
  font-size: 14px;
  text-wrap: nowrap;
`

const Choices = styled.div`
    border: 2px solid #C4D0FB;
    background: #fff;
    padding: 15px;
    margin: 5px 0;
    width: 90%;
    border-radius: 18px;
    font-size: 14px;
    cursor: pointer;
`

const Row = styled.div`
  width: 90%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`