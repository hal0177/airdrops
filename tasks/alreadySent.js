"use strict"

const fs = require("fs")
const dotenv = require("dotenv")
const ERC20 = require("../ERC20")
const Web3 = require("web3")
const { ethers } = require("ethers")

dotenv.config()

const PROVIDER = process.env.PROVIDER
const FREE_ADDR = process.env.FREE_ADDR
const SENDER = "0x4f842a761f9fb00ed31a615b78f52d549dcaf9c8"

const data = fs.readFileSync("./prepared/sortedByRef.json")

const web3 = new Web3(PROVIDER)
const free = new web3.eth.Contract(ERC20, FREE_ADDR)

const provider = new ethers.providers.JsonRpcProvider(PROVIDER)
const iface = new ethers.utils.Interface(ERC20)

const buildNew = async () => {
  const sendTxs = [ 
    "0xb55606ceebabbd1d92dc7881a5db3905436784352ccc83c0f342599b8f19bec7",
    "0x6f7e9da1087d666c5dc91d2cc291a1cefee1047bb37ad87d2185ff3a70a5d612",
    "0xfac04e2904a80fdc405a03da55f00b09cf498c48a649298fe59f05f4d0368e2f",
    "0xe3c6b7b6509efc751e1fb98d0855ef380944bd0260e8828a3d1a51ae0f81224a",
    "0x60d38b88fd3b9a4df3387a837ffc7ead79ab4f0d19255a4150ec5abf2505b355",
    "0xbbeda65a25989539b7bcbc76d94e8c2fc26d6dc8d82982eb6893bf29eef887dd",
    "0x48ba5a641ae07c95cbf4fc686b8449cf102cdd8b160317b74304acb216f06a7d",
    "0x1148ce52596c58fabffa2382ea74f9498a2006c3051530d6d3036d1060b5d8f6",
    "0xf16e84977c8be513347dd8b6b71dd2088116a245cef93b206955cde76bec92fa",
    "0x0d2fd89e632c0aa5fbc6558e7919a3e11a284b4d29d07d35573a280e9e5a3b8f",
    "0xcd7a45a7c973fa403ed19e962b7cf92e4b1a4fe50960a5decfd5798a10fb5746",
    "0x90eea2de2865d59c8a913f060b9898a24c3ec050c3b4adc670f51e07fdc6b805",
    "0x310ddb807927e66382853fc14c920f1f186f3e7a32479ffb15818c7412d09c92",
    "0xda2ecf3ac2410affa486fa005bc844e2263e1ba6b00c52cf27b7d403323b18a0",
    "0xa7659a58310bddeb9bbbd196412de98df042d3ec30eb4f598a834b3e697d1f73",
    "0x5fb815ff6b075efbe7487076ddb694e00fcf6aa6be225b9fdc5f24baf17d4af0"
  ]
  
  let receivers = []

  for(let i = 0; i < sendTxs.length; i++) {
    let tx = await web3.eth.getTransaction(sendTxs[i])
    receivers.push(tx.to.toLowerCase())
  }

  console.log(`Sent tx's length: ${ receivers.length }`)

  const { FREEMOON } = JSON.parse(data)
  console.log(`Length before: ${ FREEMOON.length }`)

  let formatted = []

  for(let i = 0; i < FREEMOON.length; i++) {
    let fmn = FREEMOON[i]
    if(!receivers.includes(fmn.I.toLowerCase())) {
      formatted.push(fmn)
    }
  }

  const reduced = JSON.stringify({ FREEMOON: formatted }, null, 2)

  fs.writeFileSync("./prepared/withoutFsnReceivers.json", reduced)

  console.log(`Length after: ${ formatted.length }`)
}

buildNew()

