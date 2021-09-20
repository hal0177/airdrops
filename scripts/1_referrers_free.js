"use strict"

const fs = require("fs")
const dotenv = require("dotenv")
const ERC20 = require("../ERC20")
const Web3 = require("web3")

dotenv.config()

const PK = process.env.PK
const PROVIDER = process.env.PROVIDER
const FREE_ADDR = process.env.FREE_ADDR

const FREE_REWARD = "5000"

const data = fs.readFileSync("./prepared/withoutFreeReceivers.json")
const { FREEMOON } = JSON.parse(data)

const allAddresses = FREEMOON.map(entry => entry.I)
let addresses = allAddresses.slice(0, 10)

let airdropping

const connect = async () => {
  const web3 = new Web3(PROVIDER)
  const account = await web3.eth.accounts.privateKeyToAccount(PK)
  const sender = account.address
  await web3.eth.accounts.wallet.add(account)
  const FREE = new web3.eth.Contract(ERC20, FREE_ADDR)
  return { web3, sender, FREE }
}


const startRewarding = async () => {  
  let current = 0
  let finalIndex = allAddresses.length - 1

  let freeSuccess = [], freeFail = []

  const init = await connect()
  let txCount = await init.web3.eth.getTransactionCount(init.sender)

  airdropping = setInterval(async () => {
    if(current >= finalIndex) return

    let currentBatchStart = current
    let currentBatchEnd = current + 9 <= finalIndex ? current + 9 : finalIndex
    let batchSize = (currentBatchEnd - currentBatchStart) + 1
    current = currentBatchEnd + 1

    console.log(`Connecting ...`)
    const { web3, sender, FREE } = await connect()
    console.log(`Connected.`)

    console.log(`Airdropping batch ${ currentBatchStart } - ${ currentBatchEnd } / ${ finalIndex }`)

    let freeRequests = []

    for(let i = 0; i < batchSize; i++) {
      console.log(sender)
      let beneficiary = addresses[i]
      freeRequests.push(FREE.methods.transfer(beneficiary, web3.utils.toWei(FREE_REWARD, "ether")).send({
        from: sender,
        gasLimit: "0xf4240",
        gasPrice: "0xb2d05e00",
        nonce: txCount + i
      }))
    }

    addresses = allAddresses.slice(currentBatchEnd + 1, currentBatchEnd + 1 + batchSize)
    txCount += batchSize
    
    const freeResults = await Promise.allSettled(freeRequests)

    const freeSuccesses = freeResults.filter(res => res.status === "fulfilled").map(res => res.to)
    const freeFailures = freeResults.filter(res => res.status === "rejected").map(res => res.to)

    freeSuccess = freeSuccess.concat(freeSuccesses)
    freeFail = freeFail.concat(freeFailures)

    console.log(`FREE tx's: Success: ${ freeSuccess.length }, Fail: ${ freeFail.length }`)

    if(currentBatchEnd >= finalIndex) {
      clearInterval(airdropping)
      const results = JSON.stringify({ SUCCESS: freeSuccess, FAIL: freeFail }, null, 2)
      fs.writeFileSync("./results/referrers-results.json", results)
    }
  }, 15000)
}



try {
  console.log(`Top 2000 Referrers: 5000 FREE & 1 FSN`)
  startRewarding()
} catch(err) {
  clearInterval(airdropping)
}
