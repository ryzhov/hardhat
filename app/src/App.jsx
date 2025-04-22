/* global ethereum */

import { BrowserProvider, getDefaultProvider, Contract } from 'ethers';
import { useState } from 'react';
import './App.css'

const ABI = [
  "function tokenURI(uint256 tokenId) view returns (string)",
  "function ownerOf(uint256 tokenId) view returns (address)",
  "function awardItem(address player, string memory tokenURI) public returns (uint256)",
];

const provider = ethereum ? new BrowserProvider(ethereum) : getDefaultProvider();
const signer = ethereum ? await provider.getSigner() : undefined;
console.log('signer =>', signer);

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [tokenUri, setTokenUri] = useState(undefined);
  const [tokenMetadata, setTokenMetadata] = useState(undefined);
  const [ownerAddress, setOwnerAddress] = useState(undefined);

  async function awardToken() {
    const contract = new Contract(contractAddress, ABI, signer);
    const uri = "https://bafybeieorvxck7qlfysiya754ertytcihamgrzq3enyeyp6tynwsemqdzy.ipfs.dweb.link?filename=hammer.json";
    try {
      const tx = await contract.awardItem(signer.getAddress(), uri);
      await tx.wait();
      console.log('awarded transaction =>', tx);
    } catch (error) {
      console.error('error =>', error);
    }
  }

  async function fetchToken() {
    const contract = new Contract(contractAddress, ABI, provider);
    try {
      const uri = await contract.tokenURI(tokenId);
      const ownerAddress = await contract.ownerOf(tokenId);
      console.log("token uri =>", uri);
      console.log("owner address =>", ownerAddress);
      const response = await fetch(uri);
      const metadata = response.json();
      console.log("metadata =>", metadata);

      setTokenUri(uri);
      setTokenMetadata(metadata);
      setOwnerAddress(ownerAddress);
    } catch (error) {
      console.error('fetch error =>', error);
      setTokenUri(undefined);
      setTokenMetadata(undefined);
      setOwnerAddress(undefined);
    }
  }

  return (
    <div className="App">
      <label>
        Contract address:
        <input
          type="text"
          size="42"
          value={contractAddress}
          onChange={({ target: { value }}) => setContractAddress(value)}
        />
      </label>
      <button disabled={!signer} onClick={awardToken}>Award token</button>

      <h1>Retrieve Token</h1>
      <label>
        Token ID:
        <input
          type="text"
          value={tokenId}
          onChange={({ target: { value }}) => setTokenId(value)}
        />
      </label>
      <button onClick={fetchToken}>Fetch token</button>

      {tokenUri && (
        <div>
          <h2>Token Details</h2>
          <img src={tokenMetadata.image} width={100}/>
          <p><strong>Name:</strong> {tokenMetadata.name}</p>
          <p><strong>Strength:</strong> {tokenMetadata.strength}</p>
          <p><strong>Owner:</strong> {ownerAddress}</p>
        </div>
      )}
    </div>
  );
}

export default App
