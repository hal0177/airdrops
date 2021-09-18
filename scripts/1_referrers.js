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
const FSN_REWARD = "0.001"

const data = fs.readFileSync("./prepared/sortedByRef.json")
const { FREEMOON } = JSON.parse(data)

const addresses = FREEMOON.map(entry => entry.I)

let airdropping

const connect = async () => {
  const web3 = new Web3(PROVIDER)
  const account = await web3.eth.accounts.privateKeyToAccount(PK)
  const sender = account.address
  await web3.eth.accounts.wallet.add(account)
  const FREE = new web3.eth.Contract(ERC20, FREE_ADDR)
  const txCount = await web3.eth.getTransactionCount(sender)
  return { web3, sender, FREE, txCount }
}


const startRewarding = async () => {  
  let current = 0
  let finalIndex = addresses.length - 1

  let freeSuccess = [], freeFail = []
  let fsnSuccess = [], fsnFail = []

  airdropping = setInterval(async () => {
    if(current >= finalIndex) return

    let currentBatchStart = current
    let currentBatchEnd = current + 9 <= finalIndex ? current + 9 : finalIndex
    let batchSize = (currentBatchEnd - currentBatchStart) + 1
    current = currentBatchEnd + 1

    console.log(`Connecting ...`)
    const { web3, sender, FREE, txCount } = await connect()
    console.log(`Connected.`)

    console.log(`Airdropping batch ${ currentBatchStart } - ${ currentBatchEnd } / ${ finalIndex }`)

    let freeRequests = [], fsnRequests = []

    for(let i = 0; i < batchSize; i++) {
      let beneficiary = addresses[i]
      freeRequests.push(FREE.methods.transfer(beneficiary, web3.utils.toWei(FREE_REWARD, "ether")).send({
        from: sender,
        gasLimit: 1000000,
        gasPrice: web3.utils.toWei("3", "gwei"),
        nonce: txCount + i
      }))
      fsnRequests.push(web3.eth.sendTransaction({
        from: sender,
        to: beneficiary,
        value: web3.utils.toWei(FSN_REWARD, "ether"),
        gasLimit: 21000,
        gasPrice: web3.utils.toWei("3", "gwei"),
        nonce: txCount + i + 1
      }))
    }
    
    const freeResults = await Promise.allSettled(freeRequests)
    const fsnResults = await Promise.allSettled(fsnRequests)

    const freeSuccesses = freeResults.filter(res => res.status === "fulfilled").map(res => res.to)
    const freeFailures = freeResults.filter(res => res.status === "rejected").map(res => res.to)
    const fsnSuccesses = fsnResults.filter(res => res.status === "fulfilled").map(res => res.to)
    const fsnFailures = fsnResults.filter(res => res.status === "rejected").map(res => res.to)

    freeSuccess = freeSuccess.concat(freeSuccesses)
    freeFail = freeFail.concat(freeFailures)
    fsnSuccess = fsnSuccess.concat(fsnSuccesses)
    fsnFail = fsnFail.concat(fsnFailures)

    if(currentBatchEnd >= finalIndex) {
      clearInterval(airdropping)
      const results = JSON.stringify({ SUCCESS: { freeSuccess, fsnSuccess }, FAIL: { fsnSuccess, fsnFail } }, null, 2)
      fs.writeFileSync("./results/referrers-results.json", results)
    }
  }, 13000)
}



try {
  console.log(`Top 2000 Referrers: 5000 FREE & 1 FSN`)
  startRewarding()
} catch(err) {
  clearInterval(airdropping)
}
