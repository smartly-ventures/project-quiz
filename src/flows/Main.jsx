import React, { useState } from 'react'
import styled from 'styled-components'
import { useAccount } from 'wagmi';
import { AvatarGenerator } from 'random-avatar-generator';

import Home from "./Home"
import Search from "./Search"
import Create from "./Create"
import Leaderboard from "./Leaderboard"
import Profile from "./Profile"

import createActive from "../assets/navigator-create-active.svg"

import homeActive from "../assets/navigator-home-active.svg"
import searchActive from "../assets/navigator-search-active.svg"
import leaderboardActive from "../assets/navigator-leaderboard-active.svg"
import profileActive from "../assets/navigator-profile-active.svg"

import homeNotActive from "../assets/navigator-home-not-active.svg"
import searchNotActive from "../assets/navigator-search-not-active.svg"
import leaderboardNotActive from "../assets/navigator-leaderboard-not-active.svg"
import profileNotActive from "../assets/navigator-profile-not-active.svg"

const Main = () => {

    const { address } = useAccount()
    let trimmedAddress, trimmedAddress2;
    if (address) {
        trimmedAddress = address.substring(0, 8) + "..." + address.substring(35, 41)
        trimmedAddress2 = address.substring(0, 10) + "..." + address.substring(31, 41)
    }

    const generateAvatar = (address) => {
        const generator = new AvatarGenerator({});
        return generator.generateRandomAvatar(address);
    }

    const [currentTab, setCurrentTab] = useState("home")

    return (
        <Wrapper>
            {
                currentTab == "search" ?
                    <Search /> : currentTab == "create" ?
                        <Create /> : currentTab == "leaderboard" ?
                            <Leaderboard /> : currentTab == "profile" ?
                                <Profile /> : <Home />
            }

            <Navigator>
                <Icons onClick={() => setCurrentTab("home")} src={currentTab == "home" ? homeActive : homeNotActive} />
                <Icons onClick={() => setCurrentTab("search")} src={currentTab == "search" ? searchActive : searchNotActive} />
                <Icons onClick={() => setCurrentTab("create")} style={{ backgroundColor: "#6A5AE0", padding: "5px", borderRadius: "50%" }} src={createActive} />
                <Icons onClick={() => setCurrentTab("leaderboard")} src={currentTab == "leaderboard" ? leaderboardActive : leaderboardNotActive} />
                <Icons onClick={() => setCurrentTab("profile")} src={currentTab == "profile" ? profileActive : profileNotActive} />
            </Navigator>
        </Wrapper>
    )
}

export default Main

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 2;
`

const Navigator = styled.div`
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border-radius: 18px 18px 0 0;
    z-index: 10;

    background-color: white;
    color: black;

    position: fixed;
    bottom: 0px;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
`

const Icons = styled.img`
    cursor: pointer;
`