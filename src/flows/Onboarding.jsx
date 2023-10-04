import React, { useEffect, useState } from 'react'
import styled from "styled-components"

import { ConnectButton } from '@rainbow-me/rainbowkit';

import onboardingImage1 from "../assets/onboarding-image-1.svg"
import onboardingImage2 from "../assets/onboarding-image-2.svg"
import onboardingImage3 from "../assets/onboarding-image-3.svg"

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
`

const Navigator = styled.div`
    width: 90%;
    max-width: 500px;
    padding: 20px;
    border-radius: 18px;

    background-color: white;
    color: black;

    position: fixed;
    bottom: 20px;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const Button = styled.button`
    background-color: #6A5AE0;
    color: white;
    border-radius: 18px;
    font-size: 16px;
    font-weight: 500;
    padding: 15px;
    width: 90%;
    white-space: nowrap;
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
    height: 40%;
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
                <ConnectButton.Custom>
                    {({
                        account,
                        chain,
                        openAccountModal,
                        openChainModal,
                        openConnectModal,
                        authenticationStatus,
                        mounted,
                    }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus === 'authenticated');

                        return (
                            <div
                                style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <Button onClick={openConnectModal} type="button">
                                                Connect Wallet
                                            </Button>
                                        );
                                    }

                                    if (chain.unsupported) {
                                        return (
                                            <Button onClick={openChainModal} type="button">
                                                Wrong network
                                            </Button>
                                        );
                                    }

                                    return (
                                        <Button type="button">
                                            Play Smartly!
                                        </Button>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
                <TextSecondary>We support the following chain <Highlight>BNB Testnet</Highlight></TextSecondary>
            </Navigator>
        </Wrapper>
    )
}

export default Onboarding
