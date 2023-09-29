import React, { useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi';
import Avatar from "boring-avatars";

import cardDivider from "../assets/profile-card-divider.svg"
import statsCardBG from "../assets/profile-statscard-bg.svg"

import nftActive from "../assets/profile-nfts-active.svg"
import statsActive from "../assets/profile-stats-active.svg"
import tokensActive from "../assets/profile-tokens-active.svg"

import nftNotActive from "../assets/profile-nfts-inactive.svg"
import statsNotActive from "../assets/profile-stats-inactive.svg"
import tokensNotActive from "../assets/profile-tokens-inactive.svg"

import rankFirst from "../assets/rank-first.svg"
import rankSecond from "../assets/rank-second.svg"
import rankThird from "../assets/rank-third.svg"

import pointsIcon from "../assets/profile-points-icon.svg"
import deployedIcon from "../assets/profile-deployed-icon.svg"
import playedIcon from "../assets/profile-played-icon.svg"

const Profile = () => {

  const { address } = useAccount()

  const trimAddress = (address) => {
    return address.substring(0, 10) + "..." + address.substring(31, 41)
  }

  const [currentTab, setCurrentTab] = useState("stats")

  return (
    <Wrapper>
      <TextPrimary style={{ margin: "50px 0 10px 0" }} >Profile</TextPrimary>
      <Avatar size={60} name={address} variant="beam" />
      <ProfileData>
        <Text>{trimAddress(address)}</Text>
        <UserStats>
          <ProfileCardData>
            <Icons src={pointsIcon} />
            <ProfileCardText>200</ProfileCardText>
          </ProfileCardData>
          <Icons src={cardDivider} />
          <ProfileCardData>
            <Icons src={deployedIcon} />
            <ProfileCardText>5</ProfileCardText>
          </ProfileCardData>
          <Icons src={cardDivider} />
          <ProfileCardData>
            <Icons src={playedIcon} />
            <ProfileCardText>15</ProfileCardText>
          </ProfileCardData>
        </UserStats>

        <Navigator>
          <Icons onClick={() => setCurrentTab("nft")} src={currentTab == "nft" ? nftActive : nftNotActive} />
          <Icons onClick={() => setCurrentTab("stats")} src={currentTab == "stats" ? statsActive : statsNotActive} />
          <Icons onClick={() => setCurrentTab("tokens")} src={currentTab == "tokens" ? tokensActive : tokensNotActive} />
        </Navigator>

        {
          currentTab == "nft" ?
            <NFTs>
              <NFT src={rankFirst} />
              <NFT src={rankSecond} />
              <NFT src={rankThird} />
            </NFTs>
            :
            <>
              <StatsCard>
                <><BG src={statsCardBG} /></>
                <Text style={{width: "300px"}}>You have played a total <span style={{color: "#6A5AE0"}} >15 quizzes</span> on blockchain!</Text>
              </StatsCard>
            </>
        }
      </ProfileData>
    </Wrapper>
  )
}

export default Profile

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
  width: 95%;
  margin-bottom: 30px;
`

const ProfileData = styled.div`
  width: 95%;
  max-width: 550px;
  height: 80%;
  padding: 20px;
  border-radius: 18px 18px 0 0;
  padding-bottom: 80px;
  margin-top: -30px;
  z-index: -1;

  background-color: #EFEEFC;
  color: black;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const Text = styled.div`
    color: black;
    margin-top: 40px;
    font-size: 20px;
    font-weight: 600;
    text-align: center;
    width: 95%;
`

const UserStats = styled.div`
  background: #6A5AE0;
  width: 95%;
  padding: 20px;
  margin-top: 30px;
  border-radius: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`

const Navigator = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 20px;

    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    margin: 20px 0;
`

const Icons = styled.img`
    cursor: pointer;
`

const NFTs = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
`

const NFT = styled.img`
  width: 30%;
`

const ProfileCardData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ProfileCardText = styled.div`
  color: white;
  margin-top: 5px;
`

const StatsCard = styled.div`
  background: #E8E5FA;
  width: 95%;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`

const BG = styled.img`
  position: absolute;
  top: 0;
  left: 0;
`