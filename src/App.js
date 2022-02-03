import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from "./utils/MyEpicNFT.json"

// Constants
const TWITTER_HANDLE = 'johnguestdev';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = "0x7F1e4307859C6439C2AE00405711EB99a424628d";

const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      setupEventListener() 
    } catch (error) {
      console.log(error)
    }
}

 // Render Methods
 const renderNotConnectedContainer = () => (
  <button onClick={connectWallet} className="cta-button connect-wallet-button">
    connect to wallet
  </button>
);

// Setup our listener.
const setupEventListener = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
        console.log(from, tokenId.toNumber())
        alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      });

      console.log("Setup event listener!")

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

const askContractToMintNft = async () => {
  try {
    const { ethereum } = window;

    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

      console.log("Going to pop wallet now to pay gas...")
      let nftTxn = await connectedContract.makeAnEpicNFT();

      console.log("Mining...please wait.")
      alert("Mining...please wait.")

      await nftTxn.wait();
      
      console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

    } else {
      console.log("Ethereum object doesn't exist!");
    }
  } catch (error) {
    console.log(error)
  }
}

const openCollection = () => {
  window.open('https://testnets.opensea.io/collection/3wordnft-v85', '_blank');

}

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      const { ethereum } = window;
    
        if (!ethereum) {
          console.log("Make sure you have metamask!");
          return;
        } else {
          console.log("We have the ethereum object", ethereum);
        }
    
      const accounts = await ethereum.request({ method: 'eth_accounts' });
    
        /*
        * User can have multiple authorized accounts, we grab the first one if its there!
        */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account)
          setupEventListener()
        } else {
          console.log("No authorized account found")
        }
    }
    checkIfWalletIsConnected();    
  }, [])

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">NFT Marketplace</p>
          <p className="sub-text">

            <p><small>Connect your wallet and switch to Rinkeby network.</small><br></br> 
            <small>Each token is randomly generated from a selection of colors and sci-fi words.</small></p>
          </p>
            <button onClick={openCollection} className="cta-button connect-wallet-button">view collection</button>
            <>                                                                                                 </>
          {currentAccount === "" ? renderNotConnectedContainer():
            (
              /** Add askContractToMintNft Action for the onClick event **/
              <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
              mint new NFT
              </button>
            )
          }
        </div>
        <div>

          <a href='https://testnets.opensea.io/collection/3wordnft-v85' target='_blank'>
            <img src="https://storage.opensea.io/files/10ff05f60c87b97d97dd0df2d531f9d9.svg" alt="NFT" width="150" height="200"></img>
          </a>

          <a href="https://testnets.opensea.io/collection/3wordnft-v85" target='_blank'>
            <img src="https://storage.opensea.io/files/50813ba7108162140f0a4f0c22b186b8.svg" alt="NFT" width="150" height="200"></img>
          </a>

          <a href="https://testnets.opensea.io/collection/3wordnft-v85" target='_blank' >
            <img src="https://storage.opensea.io/files/d2913912ddea89fd75afa38b89c19e88.svg" alt="NFT" width="150" height="200"></img>
          </a>

          <a href="https://testnets.opensea.io/collection/3wordnft-v85" target='_blank'>
            <img src="https://storage.opensea.io/files/5be44fe938bc8be75d38a3d313504369.svg" alt="NFT" width="150" height="200"></img>
          </a>

          <a href="https://testnets.opensea.io/collection/3wordnft-v85" target='_blank'>
            <img src="https://storage.opensea.io/files/dd1e946f0a1cd32256f8c9d5bfdfd5b0.svg" alt="NFT" width="150" height="200"></img>           
          </a>

          <a href="https://testnets.opensea.io/collection/3wordnft-v85" target='_blank'>
            <img src="https://storage.opensea.io/files/016dd40e3af87f73f1cc5b2dace3f573.svg" alt="NFT" width="150" height="200"></img> 
          </a>

        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
