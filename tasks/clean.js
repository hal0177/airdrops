"use strict"

const fs = require("fs")
// const dotenv = require("dotenv")
// const Web3 = require("web3")
// const ERC20 = require("../ERC20")
// const { ethers } = require("ethers")

// dotenv.config()
// const PROVIDER = process.env.PROVIDER
// const FREE_ADDR = process.env.FREE_ADDR

// const SENDER = "0x4f842a761f9fb00ed31a615b78f52d549dcaf9c8".toLowerCase()


const data = fs.readFileSync("./prepared/sortedByRef.json")

// const web3 = new Web3(PROVIDER)
// const free = new web3.eth.Contract(ERC20, FREE_ADDR)

// const provider = new ethers.providers.JsonRpcProvider(PROVIDER)
// const iface = new ethers.utils.Interface(ERC20)



// const getEvents = async limit => {
//   let blockNumber = 5354246
//   let freeTransfers = []
//   let start = 0
//   const cycling = setInterval(async () => {
//     if(start === limit) return
//     let checkBlock = blockNumber
//     blockNumber++
//     const transfersThisBlock = await free.getPastEvents("allEvents", { fromBlock: checkBlock, toBlock: checkBlock })
//     transfersThisBlock.map(async ts => {
//       const tx = await web3.eth.getTransaction(ts.transactionHash)
//       if(tx.to.toLowerCase() === FREE_ADDR.toLowerCase()) {
//         if(tx.from.toLowerCase() === SENDER.toLowerCase()) {
//           const parsed = iface.parseTransaction({ data: tx.input, value: tx.value })
//           freeTransfers.push(parsed.args._to.toLowerCase())
//           console.log(freeTransfers)
//         }
//       }
//     })
//     start++
//   }, 200)
// }


const buildNew = async () => {
  // const toAddrs = await getEvents(6)
  const toAddrs = [
    '0x948585f3dfb6c58c6b5704579bc244f27dc325f6',
    '0xe159f23b90c04c954e69aad5939ec07a6d3e4465',
    '0x43fd9050bcc9c2b2a9f32aea44fd62128926ffd0',
    '0xc2dfe2476b0f13fe051d6142df74f83b8acca3c0',
    '0xd16029c821ede99f17e4426c6956c1f62f8119b0',
    '0x8877f95ca2516fe8399863aa4f616397f34971d4'
  ]
  const { FREEMOON } = JSON.parse(data)

  FREEMOON.map((fmn, index) => {
    if(fmn.J === 436) console.log(fmn)
    if(toAddrs.includes(fmn.I.toLowerCase())) {
      FREEMOON.splice(index, 1)
    } 
  })

  for(let i = 0; i < FREEMOON.length; i++) {
    let fmn = FREEMOON[i]
    if(toAddrs.includes(fmn.I.toLowerCase())) {
      FREEMOON.splice(i, 1)
    }
  }

  console.log(`New sortedByRef length: ${ FREEMOON.length }`)

  const format = JSON.stringify({ FREEMOON }, null, 2)

  fs.writeFileSync("./prepared/withoutFreeReceivers.json", format)
}


buildNew()