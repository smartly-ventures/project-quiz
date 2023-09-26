import React from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi';
import Avatar from "boring-avatars";

import top3Ranks from '../assets/leaderboard-top3-ranks.svg'
import leaderboardBG from '../assets/leaderboard-bg.svg'

const Leaderboard = () => {

  const { address } = useAccount()

  const trimAddress = (address) => {
    return address.substring(0, 8) + "..." + address.substring(35, 41)
  }

  const trimAddress2 = (address) => {
    return address.substring(0, 4) + "..." + address.substring(38, 41)
  }

  return (
    <Wrapper>
      <TextPrimary style={{ margin: "50px 0 10px 0" }} >Leaderboard</TextPrimary>
      <Top3Ranks>
        <Details2 style={{ marginBottom: "-150px" }} >
          <Avatar size={40} name={"2"} variant="beam" />
          <Address2>{trimAddress2(address)}</Address2>
          <Points2>200 SIQ</Points2>
        </Details2>
        <Details2 style={{ marginBottom: "-80px" }} >
          <Avatar size={40} name={"1"} variant="beam" />
          <Address2>{trimAddress2(address)}</Address2>
          <Points2>200 SIQ</Points2>
        </Details2>
        <Details2 style={{ marginBottom: "-220px" }} >
          <Avatar size={40} name={"3"} variant="beam" />
          <Address2>{trimAddress2(address)}</Address2>
          <Points2>200 SIQ</Points2>
        </Details2>
      </Top3Ranks>
      <img style={{ marginTop: "100px" }} src={top3Ranks} />
      <BGCircle src={leaderboardBG} />
      <OtherRanks>
        <Details>
          <Position>4</Position>
          <Avatar size={40} name={"4"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
        <Details>
          <Position>5</Position>
          <Avatar size={40} name={"5"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
        <Details>
          <Position>6</Position>
          <Avatar size={40} name={"6"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
        <Details>
          <Position>7</Position>
          <Avatar size={40} name={"7"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
        <Details>
          <Position>8</Position>
          <Avatar size={40} name={"8"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
        <Details>
          <Position>9</Position>
          <Avatar size={40} name={"9"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
        <Details>
          <Position>10</Position> 
          <Avatar size={40} name={"10"} variant="beam" />
          <Text>
            <Address>{trimAddress(address)}</Address>
            <Points>200 SIQ</Points>
          </Text>
        </Details>
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