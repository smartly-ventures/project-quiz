import './index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { bscTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

import App from './App.jsx'

const { chains, publicClient } = configureChains(
  [bscTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Smartly',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider appInfo={{ appName: 'Smartly' }} chains={chains} theme={darkTheme()} initialChain={bscTestnet}>
      <App />
    </RainbowKitProvider>
  </WagmiConfig>
  ,
)
