import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import JSConfetti from 'js-confetti'
import CryptoJS from 'crypto-js'
import OpenAI from "openai";
import toast, { Toaster } from 'react-hot-toast';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';

import deployer from "../abi/deployer.json"
import quizABI from "../abi/quiz.json"

import copyIcon from "../assets/create-copy-icon.svg"
import aiQuiz from "../assets/create-ai-quiz.svg"
import manualQuiz from "../assets/create-manual-quiz.svg"
import addOption from "../assets/create-add-option.svg"
import finalBG from "../assets/create-final-bg.svg"

const Create = () => {

  const [quizCreated, setQuizCreated] = useState(false)
  const [answersAdded, setAnswersAdded] = useState(false)

  const { address } = useAccount()
  const deployerContractAddress = "0x1218950c9E1e150F78C8b53260eAEb23e6885A31";
  const DeployerABI = deployer.output.abi;

  const [latestDeployedAddress, setLatestDeployedAddress] = useState("0x1218950c9E1e150F78C8b53260eAEb23e6885A31")

  const deployQuiz = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider =
          new ethers.providers.Web3Provider(
            ethereum,
          );
        const signer = provider.getSigner();
        const deployerContract =
          new ethers.Contract(
            deployerContractAddress,
            DeployerABI,
            signer,
          );
        toast('Deploying Quiz...', { style: { padding: '10px', color: '#FFFFFF', background: "#FFB380" } });
        let deployNewQuiz =
          await deployerContract.createQuiz(
            quiz.quizTitle,
            quiz.quizDescription
          );
        let res = await deployNewQuiz.wait();
        console.log(res)
        setQuizCreated(true)
        setLatestDeployedAddress(await deployerContract.contractsDeployed(address, (Number(await deployerContract.numberOfContractsDeployed(address)) - 1)))
        console.log(latestDeployedAddress)
        toast.success("Quiz Deployed")

        if (creatorMode == "ai") {
          setTitle("Finalize Quiz")
          getQuiz(10, title, "intermidiate")
        } else {
          setTitle("Add Questions")
        }

      }

    } catch (error) {
      console.log(error.message);
      toast.error('Failed Creating Quiz');
    }
  };

  const QuizABI = quizABI.output.abi;

  const uploadQuestion = async () => {
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
            latestDeployedAddress,
            QuizABI,
            signer,
          );
        toast('Uploading Question...', { style: { padding: '10px', color: '#FFFFFF', background: "#FFB380" } });
        let uploadQuestion =
          await quizContract.addQuestion(
            encryptQuiz(quiz)
          );
        let res = await uploadQuestion.wait();
        console.log(res)
        setAnswersAdded(true)
        toast.success("Questions Uploaded")
        sendThemFlying()
      }

    } catch (error) {
      console.log(error.message);
      toast.error('Failed To Add Questions');
    }
  };

  const setBet = async () => {
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
            latestDeployedAddress,
            QuizABI,
            signer,
          );
        toast('Setting Bet...', { style: { padding: '10px', color: '#FFFFFF', background: "#FFB380" } });
        let setBet =
          await quizContract.setPerPersonBet(betAmount);
        let res = await setBet.wait();
        console.log(res)
        toast.success("Betting Amount Set")
      }

    } catch (error) {
      console.log(error.message);
      toast.error('Betting Amount Not Set');
    }
  };

  const [quiz, setQuiz] = useState({ quizTitle: "", quizDescription: "", questions: [] })

  const encryptQuiz = (decryptedQuiz) => {
    return CryptoJS.AES.encrypt(JSON.stringify(decryptedQuiz), import.meta.env.VITE_AES_SECRET_KEY).toString();
  }

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true
  });

  const getQuiz = async (numberOfQuestion, topic, level) => {
    try {
      let tempQuiz = quiz;
      tempQuiz.questions.push(await openai.createCompletion({
        model: "gpt-3.5-turbo-instruct",
        prompt: `respond only in code and strictly dont include any other supporting text in your response with a ${numberOfQuestion} unique, new and random questions with 4 options quiz on topic ${topic} of ${level} level with different pointsIfCorrenct for each question depending on level of difficulty but with total for all questions equal to 100 in an array of objects format only, strictly use the below scema only: 
          [ { question: "", options: { 1: "", 2: "", 3: "", 4: "", }, correctOption: "", pointsIfCorrenct: "" } ]`,
        temperature: 1,
      }))
      setQuiz(tempQuiz);
    } catch (err) {
      console.log(err)
    }
  }

  const sendThemFlying = () => {
    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
      emojis: ['🥳', '🎉'],
      emojiSize: 100,
      confettiNumber: 30,
    })
  }

  const trimAddress2 = (address) => {
    return address.substring(0, 8) + "..." + address.substring(34, 41)
  }

  const [title, setTitle] = useState("Create Quiz")

  const sendNotification = async () => {
    if (creatorMode != "") {
      if (quizTitle != "") {
        if (quizDescription != "") {
          quiz.quizTitle = quizTitle;
          quiz.quizDescription = quizDescription;
          await deployQuiz()
          console.log("All Done")
        } else {
          toast.error('Description Required');
        }
      } else {
        toast.error('Title Required');
      }
    } else {
      toast.error('Select Creator Mode');
    }
  }

  const sendNotificationQuestion = async () => {
    if (question.question != "") {
      if (question.pointsIfCorrenct != "") {
        if (question.options != "") {
          let tempQuiz = quiz;
          tempQuiz.questions.push(question);
          setQuiz(tempQuiz);
          setQuestion({ question: "", options: { 1: "", 2: "", 3: "", 4: "", }, correctOption: "", pointsIfCorrenct: "" });
        } else {
          toast.error('Add Options');
        }
      } else {
        toast.error('Add Points');
      }
    } else {
      toast.error('Add Question');
    }
  }

  const [creatorMode, setCreatorMode] = useState("")
  const [quizTitle, setQuizTitle] = useState("")
  const [quizDescription, setQuizDescription] = useState("")
  const [openAnswerDiv, setOpenAnswerDiv] = useState(0)
  const [question, setQuestion] = useState({ question: "", options: { 1: "", 2: "", 3: "", 4: "", }, correctOption: "", pointsIfCorrenct: "" })
  const [betAmount, setBetAmount] = useState(0)

  useEffect(() => {
    console.log(quiz)
    console.log(question)
  }, [quiz, question])

  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(latestDeployedAddress);
      toast.success('Address Copied');
    } catch (err) {
      toast.error('Failed To Copy');
    }
  }

  return (
    <Wrapper>
      <TextPrimary style={{ margin: "50px 0 10px 0" }} >{title}</TextPrimary>
      {
        title == "Create Quiz" ?
          <QuizDiv>
            <Choices>
              <BoxChoices style={creatorMode == "ai" ? { background: "#FF8FA2" } : {}} onClick={() => { setCreatorMode("ai") }} >
                <Icons src={aiQuiz} />
                <TextPrimary style={{ fontSize: "14px", marginTop: "10px" }} >Create Quiz <br /> With AI</TextPrimary>
              </BoxChoices>
              <BoxChoices style={creatorMode == "manual" ? { background: "#FF8FA2" } : {}} onClick={() => { setCreatorMode("manual") }} >
                <Icons src={manualQuiz} />
                <TextPrimary style={{ fontSize: "14px", marginTop: "10px" }} >Create Quiz <br /> Manually</TextPrimary>
              </BoxChoices>
            </Choices>
            <Label>Title</Label>
            <Input placeholder="Are You A Web3 Degen?" onChange={(e) => setQuizTitle(e.target.value)} />
            <Label>Description</Label>
            <Input placeholder="Prove You Are A Degen By Taking This Quiz..." onChange={(e) => setQuizDescription(e.target.value)} />
            <Button type='reset' onClick={sendNotification} >Create Quiz</Button>
          </QuizDiv> :

          title == "Add Questions" ?
            <QuizDiv style={{ paddingBottom: "80px" }} >
              <QuestionNumber>{quiz.questions.length + 1}</QuestionNumber>

              <Label>Add Question</Label>
              <Input placeholder="Do you make smart contract quizzes using smartly?" onChange={(e) => question.question = e.target.value} />
              <Label>Set Points</Label>
              <Input type='number' placeholder='69' onChange={(e) => question.pointsIfCorrenct = e.target.value} />
              <Label>Add Options</Label>

              <Choices>
                <BoxChoices style={question.correctOption == 1 ? { background: "#C9F2E9" } : question.correctOption == "" ? {} : { background: "#FF8FA2" }} onClick={() => { setOpenAnswerDiv(1) }} >
                  <Icons2 src={addOption} />
                  <TextPrimary style={{ fontSize: "14px", marginTop: "10px" }} >Add Option</TextPrimary>
                </BoxChoices>
                <BoxChoices style={question.correctOption == 2 ? { background: "#C9F2E9" } : question.correctOption == "" ? {} : { background: "#FF8FA2" }} onClick={() => { setOpenAnswerDiv(2) }} >
                  <Icons2 src={addOption} />
                  <TextPrimary style={{ fontSize: "14px", marginTop: "10px" }} >Add Option</TextPrimary>
                </BoxChoices>
              </Choices>
              <Choices>
                <BoxChoices style={question.correctOption == 3 ? { background: "#C9F2E9" } : question.correctOption == "" ? {} : { background: "#FF8FA2" }} onClick={() => { setOpenAnswerDiv(3) }} >
                  <Icons2 src={addOption} />
                  <TextPrimary style={{ fontSize: "14px", marginTop: "10px" }} >Add Option</TextPrimary>
                </BoxChoices>
                <BoxChoices style={question.correctOption == 4 ? { background: "#C9F2E9" } : question.correctOption == "" ? {} : { background: "#FF8FA2" }} onClick={() => { setOpenAnswerDiv(4) }} >
                  <Icons2 src={addOption} />
                  <TextPrimary style={{ fontSize: "14px", marginTop: "10px" }} >Add Option</TextPrimary>
                </BoxChoices>
              </Choices>

              <Button type="reset" onClick={sendNotificationQuestion} >Add Question</Button>
              {quiz.questions.length != 0 ? <Button style={{ marginTop: "-5px" }} onClick={() => { setTitle("Finalize Quiz") }} >Complete Quiz</Button> : <></>}
            </QuizDiv> :
            answersAdded == false ?
              <>
                <FinalBG src={finalBG} />
                <QuizDiv>
                  <Label style={{ fontSize: "16px" }} >Title: {quiz.quizTitle}</Label>
                  <Label style={{ fontSize: "12px", color: "#858494" }} >Description: {quiz.quizDescription}</Label>
                </QuizDiv>
                <QuizDiv style={{ paddingBottom: "80px" }}>
                  <Label style={{ fontSize: "16px" }} >Questions:</Label>
                  {quiz.questions.map((question, index) => {
                    return (
                      <Question>
                        <SrNo>{index + 1}</SrNo>
                        <Text>{question.question}</Text>
                      </Question>
                    )
                  })}
                  <Button type="reset" onClick={async () => { await uploadQuestion() }} >Upload Questions</Button>
                </QuizDiv>
              </> :
              <>
                <FinalBG src={finalBG} />
                <QuizDiv style={{ paddingBottom: "80px" }} >
                  <Label style={{ fontSize: "16px" }} >Quiz Ready</Label>
                  <Label style={{ fontSize: "12px", color: "#858494", display: "flex", flexDirection: "row", alignItems: "center" }} >{trimAddress2(latestDeployedAddress)} <img style={{ marginLeft: "10px" }} src={copyIcon} onClick={copyContent} /></Label>
                  <Label style={{ fontSize: "12px", color: "#858494" }} >Copy And Share The Address With Your Friends And Ask Them To Search The Address To Play The Quiz</Label>
                  <Label>Bet Amount in Wei (Optional)</Label>
                  <Input placeholder={0} onChange={(e) => setBetAmount(e.target.value)} type='number' />
                  <Button type='reset' onClick={setBet} >Set Betting Amount</Button>
                </QuizDiv>
              </>
      }
      <Toaster position="top-right" />

      <AnsBG style={openAnswerDiv != 0 ? {} : { display: "none" }} >
        <AnswerDiv>
          <Label>Add Answer</Label>
          <Input onChange={(e) => { question.options[openAnswerDiv] = e.target.value }} />
          <ISCorrectDiv>
            <Label style={{ width: "40%", margin: "5px 0" }} >Is Correct?</Label>
            <Input style={{ width: "15px", height: "15px" }} type='checkbox' onChange={(e) => { question.correctOption = openAnswerDiv }} />
          </ISCorrectDiv>
          <Button type='reset' onClick={() => { setOpenAnswerDiv(0) }} >Add Answer</Button>
        </AnswerDiv>
      </AnsBG>
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

const BoxChoices = styled.div`
    background: #C4D0FB;
    padding: 15px;
    width: 40%;
    height: 150px;
    border-radius: 18px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
`

const Choices = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 20px;
    width: 100%;
`

const Icons = styled.img`
    padding: 10px;
    background: white;
    border-radius: 8px;
`

const Icons2 = styled.img`
`

const AnswerDiv = styled.form`
  width: 90%;
  max-width: 450px;

  position: absolute;
  padding: 20px;
  border-radius: 18px;
  z-index: 20;

  background-color: #FFF;
  color: black;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const AnsBG = styled.div`
  width: 100%;
  height: 100%;

  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;

  background-color: rgba(0,0,0,0.5);

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const ISCorrectDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 15px;
  width: 90%;
`

const QuestionNumber = styled.div`
  background: black;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 30px;
  height: 30px;
`

const Question = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  background: #FFFFFF;
  width: 90%;
  padding: 20px;
  border-radius: 12px;
`

const SrNo = styled.div`
    color: #858494;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    border: 2px solid #E6E6E6;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin: 0 20px;
    padding: 10px;
`

const Text = styled.div`
    margin: 0 20px;
    font-size: 14px;
    font-weight: 400;
`

const FinalBG = styled.img`
  width: 90%;
  max-width: 450px;
  margin: 10px 0 -15px 0;
`