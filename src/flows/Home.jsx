import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi';
import Avatar from "boring-avatars";
import { ethers } from 'ethers';

import deployer from "../abi/deployer.json"

import welcomeSun from "../assets/welcome-sun.svg"
import challengeFriends from "../assets/challenge-friends.svg"
import card1BG from "../assets/card1-bg.svg"
import card2BG1 from "../assets/card2-bg1.svg"
import card2BG2 from "../assets/card2-bg2.svg"
import card1Badge from "../assets/card1-badge.svg"

const Home = () => {

    const { address } = useAccount()
    const [latestDeployedAddress, setLatestDeployedAddress] = useState("0x0000000000000000000000000000000000000000")
    const deployerContractAddress = "0x1218950c9E1e150F78C8b53260eAEb23e6885A31";
    const DeployerABI = deployer.output.abi;

    const getLatestQuiz = async () => {
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
                setLatestDeployedAddress(await deployerContract.contractsDeployed(address, (Number(await deployerContract.numberOfContractsDeployed(address)) - 1)))
                console.log(await deployerContract.contractsDeployed(address, (Number(await deployerContract.numberOfContractsDeployed(address)) - 1)))
            }

        } catch (error) {
            console.log(error.message);
        }
    };

    let trimmedAddress, trimmedAddress2
    if (address) {
        trimmedAddress = address.substring(0, 8) + "..." + address.substring(35, 41)
        trimmedAddress2 = latestDeployedAddress.substring(0, 10) + "..." + latestDeployedAddress.substring(31, 41)
    }

    useEffect(() => {
        getLatestQuiz()
    }, [])


    return (
        <Wrapper>
            <Header>
                <HeaderTextSection>
                    <Text1><img style={{ marginRight: "10px" }} src={welcomeSun} />Welcome To The Game!</Text1>
                    <Text2>{trimmedAddress}</Text2>
                </HeaderTextSection>
                <Avatar
                    size={40}
                    name={address}
                    variant="beam"
                />
            </Header>

            <Card1>
                <CardTextSection>
                    <Text1 style={{ color: "#FF8FA2" }} >Recently Deployed Quiz</Text1>
                    <Text2 style={{ color: "#660012", fontSize: "18px" }} >{trimmedAddress2}</Text2>
                </CardTextSection>
                <CardBG style={{ width: "100%", height: "90px", maxWidth: "600px", objectFit: "cover" }} src={card1BG} />
                <UserPFP src={card1Badge} />
            </Card1>

            <Card2>
                <CardBG style={{ zIndex: "1", bottom: 0, left: 0 }} src={card2BG1} />
                <CardBG style={{ zIndex: "1", top: 0, right: 0 }} src={card2BG2} />
                <Text2 style={{ fontSize: "16px" }} >FEATURED</Text2>
                <Text2 style={{ fontWeight: "600", width: "80%", maxWidth: "350px", textAlign: "center", margin: "10px 0" }}>Make a Quiz and ask your friends to bet on their knowlegde, earn SIQ Tokens and NFTs!</Text2>
                <Button><img style={{ marginRight: "10px" }} src={challengeFriends} />Challenge Friends</Button>
            </Card2>
        </Wrapper>
    )
}

export default Home

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
`

const Header = styled.div`
    width: 100%;
    max-width: 600px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`

const HeaderTextSection = styled.div`
    display: flex;
    flex-direction: column;
`

const UserPFP = styled.img`
    height: 50px;
`

const Text1 = styled.span`
    color: #FFD6DD;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 14px;
`

const Text2 = styled.span`
    font-size: 20px;
    text-align: left;
    display: flex;
    flex-direction: row;
    align-items: center;
`

const Card1 = styled.div`
    background: #FFCCD5;
    width: 90%;
    max-width: 600px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    overflow: hidden;
`

const CardTextSection = styled.div`
    display: flex;
    flex-direction: column;
`

const CardBG = styled.img`
    position: absolute;
`

const Card2 = styled.div`
    background: #9087E5;
    width: 90%;
    max-width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    padding: 20px;
    border-radius: 12px;
    margin: 20px 0;
    position: relative;
    overflow: hidden;
`

const Button = styled.button`
    color: #6A5AE0;
    background: white;
    border-radius: 18px;
    font-size: 16px;
    font-weight: 500;
    padding: 15px;
    white-space: nowrap;
    margin: 20px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
`