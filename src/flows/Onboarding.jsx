import React, { useEffect, useState } from 'react'
import styled from "styled-components"

import onboardingImage1 from "../assets/onboarding-image-1.svg"
import onboardingImage2 from "../assets/onboarding-image-2.svg"
import onboardingImage3 from "../assets/onboarding-image-3.svg"

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Navigator = styled.div`
    width: 80%;
    max-width: 500px;
    padding: 20px;
    border-radius: 18px;

    background-color: white;
    color: black;

    position: absolute;
    bottom: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Button = styled.button`
    background-color: #6A5AE0;
    border-radius: 18px;
    font-size: 16px;
    font-weight: 500;
    padding: 15px;
    width: 90%;
    margin: 20px 0;
`

const TextPrimary = styled.span`
    text-align: center;
    color: black;
    font-size: 24px;
    font-weight: 600;
    width: 90%;
`

const TextSecondary = styled.span`
    text-align: center;
    color: #858494;
    font-size: 12px;
    font-weight: 600;
    width: 90%;
`

const Highlight = styled.span`
    color: #6A5AE0;
    cursor: pointer;
`

const Image = styled.img`
    width: 400px;
    height: 50vh;
    margin-top: 80px;
`

const Onboarding = () => {


    const onboardingSlidesData = [
        {
            image: onboardingImage1,
            text: "Creating smart-contract quizzes becomes simple!"
        },
        {
            image: onboardingImage2,
            text: "Place bets on chain, win cool NFTs and Tokens!"
        },
        {
            image: onboardingImage3,
            text: "Ask AI to create amazing quizzes for you for free!"
        }
    ]

    var slideIndex = 0;

    const [image, setImage] = useState(onboardingSlidesData[slideIndex].image)
    const [text, setText] = useState(onboardingSlidesData[slideIndex].text)

    useEffect(() => {
        setInterval(function () {
            if (slideIndex < 2) {
                slideIndex++;
            } else {
                slideIndex = 0;
            }
            setImage(onboardingSlidesData[slideIndex].image)
            setText(onboardingSlidesData[slideIndex].text)
            console.log(slideIndex)
        }, 5000);
    }, [slideIndex])


    return (
        <Wrapper>
            <Image src={image} />
            <Navigator>
                <TextPrimary>{text}</TextPrimary>
                <Button>Sign Up</Button>
                <TextSecondary>Already have an account? <Highlight>Connect Wallet</Highlight></TextSecondary>
            </Navigator>
        </Wrapper>
    )
}

export default Onboarding
