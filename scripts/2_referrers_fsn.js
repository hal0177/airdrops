"use strict"

const fs = require("fs")
const dotenv = require("dotenv")
const Web3 = require("web3")

dotenv.config()

const PK = process.env.PK
const PROVIDER = process.env.PROVIDER

const FSN_REWARD = "1"

const data = fs.readFileSync("./prepared/withoutFsnReceivers.json")
const { FREEMOON } = JSON.parse(data)

const allAddresses = FREEMOON.map(entry => entry.I)
let addresses = allAddresses.slice(0, 10)

let airdropping

const connect = async () => {
  const web3 = new Web3(PROVIDER)
  const account = await web3.eth.accounts.privateKeyToAccount(PK)
  const sender = account.address
  await web3.eth.accounts.wallet.add(account)
  return { web3, sender }
}


const startRewarding = async () => {  
  let current = 0
  let finalIndex = allAddresses.length - 1

  const init = await connect()
  let txCount = await init.web3.eth.getTransactionCount(init.sender)

  airdropping = setInterval(async () => {
    if(current >= finalIndex) return

    let currentBatchStart = current
    let currentBatchEnd = current + 9 <= finalIndex ? current + 9 : finalIndex
    let batchSize = (currentBatchEnd - currentBatchStart) + 1
    current = currentBatchEnd + 1

    const results = fs.readFileSync("./results/referrers-fsn-results.json")
    const { SUCCESS, FAIL } = JSON.parse(results)

    console.log(`Connecting ...`)
    const { web3, sender } = await connect()
    console.log(`Connected.`)

    console.log(`Airdropping batch ${ currentBatchStart } - ${ currentBatchEnd } / ${ finalIndex }`)

    let fsnRequests = []

    for(let i = 0; i < batchSize; i++) {
      console.log(sender)
      let beneficiary = addresses[i]
      // fsnRequests.push(web3.eth.sendTransaction({
      //   from: sender,
      //   to: beneficiary,
      //   value: web3.utils.toWei(FSN_REWARD, "ether"),
      //   gasLimit: "0x5208",
      //   gasPrice: "0xb2d05e00",
      //   nonce: txCount + i + 1
      // }))
      fsnRequests.push(`this is a promise ${ beneficiary }`)
    }

    addresses = allAddresses.slice(currentBatchEnd + 1, currentBatchEnd + 1 + batchSize)
    txCount += batchSize
    
    const fsnResults = await Promise.allSettled(fsnRequests)

    const fsnSuccesses = fsnResults.filter(res => res.status === "fulfilled").map(res => res.to)
    const fsnFails = fsnResults.filter(res => res.status === "rejected").map(res => res.to)

    const addResults = { SUCCESS: SUCCESS.concat(fsnSuccesses.map(res => res.to)), FAIL: FAIL.concat(fsnFails.map(res => res.to)) }
    const results = JSON.stringify(addResults, null, 2)
    fs.writeFileSync("./results/referrers-fsn-results.json", results)

    if(currentBatchEnd >= finalIndex) {
      clearInterval(airdropping)
    }
  }, 15000)
}



try {
  console.log(`Top 2000 Referrers: 5000 FREE & 1 FSN`)
  startRewarding()
} catch(err) {
  clearInterval(airdropping)
}
