import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi';
import Avatar from "boring-avatars";
import { ethers } from 'ethers';

import deployer from "../abi/deployer.json"

import top3Ranks from '../assets/leaderboard-top3-ranks.svg'
import leaderboardBG from '../assets/leaderboard-bg.svg'

const Leaderboard = () => {

  const [leaderboard, setLeaderboard] = useState([
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000",
    "0x0000000000000000000000000000000000000000"
  ])

  const [pointsEarned, setPointsEarned] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

  const deployerContractAddress =
    "0xb072d8deDb8B98baE0973E6F89D791A517962974";
  const DeployerABI = deployer.output.abi;

  const getLeaderboard = async () => {
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

        for (let i = 0; i < 10; i++) {
          let player = await deployerContract.leaderboard(i);
          leaderboard[i] = player
          let points = await deployerContract.totalPointsEarned(player);
          pointsEarned[i] = points
        }
      }

    } catch (error) {
      console.log(error.message);
    }
  };


  const { address } = useAccount()

  const trimAddress = (address) => {
    return address.substring(0, 6) + "..." + address.substring(35, 41)
  }

  const trimAddress2 = (address) => {
    return address.substring(0, 4) + "..." + address.substring(38, 41)
  }

  useEffect(() => {
    getLeaderboard()
  }, [])

  return (
    <Wrapper>
      <TextPrimary style={{ margin: "50px 0 10px 0" }} >Leaderboard</TextPrimary>
      <Top3Ranks>
        <Details2 style={{ marginBottom: "-150px" }} >
          <Avatar size={40} name={leaderboard[1]} variant="beam" />
          <Address2>{trimAddress2(leaderboard[1])}</Address2>
          <Points2>{pointsEarned[1]} SIQ</Points2>
        </Details2>
        <Details2 style={{ marginBottom: "-80px" }} >
          <Avatar size={40} name={leaderboard[0]} variant="beam" />
          <Address2>{trimAddress2(leaderboard[0])}</Address2>
          <Points2>{pointsEarned[0]} SIQ</Points2>
        </Details2>
        <Details2 style={{ marginBottom: "-220px" }} >
          <Avatar size={40} name={leaderboard[3]} variant="beam" />
          <Address2>{trimAddress2(leaderboard[3])}</Address2>
          <Points2>{pointsEarned[2]} SIQ</Points2>
        </Details2>
      </Top3Ranks>
      <img style={{ marginTop: "100px" }} src={top3Ranks} />
      <BGCircle src={leaderboardBG} />
      <OtherRanks>
        {
          leaderboard.splice(3, 9).map((player, index) => {
            return (
              <Details>
                <Position>{index + 4}</Position>
                <Avatar size={40} name={player} variant="beam" />
                <Text>
                  <Address>{trimAddress(player)}</Address>
                  <Points>{pointsEarned[index + 3]} SIQ</Points>
                </Text>
              </Details>
            )
          })
        }
      </OtherRanks>
    </Wrapper>
  )
}

export default Leaderboard

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

const OtherRanks = styled.div`
  width: 90%;
  max-width: 550px;
  padding: 20px;
  border-radius: 18px 18px 0 0;
  padding-bottom: 80px;

  background-color: #EFEEFC;
  color: black;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Details = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
  background: #FFFFFF;
  width: 90%;
  padding: 20px;
  border-radius: 12px;
`

const Position = styled.div`
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
    font-size: 16px;
    font-weight: 500;
`

const Points = styled.div`
    color: #858494;
    font-size: 12px;
`

const Address = styled.div`
    color: black;
`

const BGCircle = styled.img`
  position: absolute;
  z-index: -1;
  width: 600px;
  margin-top: 30px;
`

const Top3Ranks = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  width: 360px;
  margin-top: 30px;
`

const Details2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Address2 = styled.div`
    color: white;
    margin: 10px 0 20px 0;
`

const Points2 = styled.div`
    color: white;
    background: #9087E5;
    font-size: 12px;
    padding: 15px;
    border-radius: 8px;
`