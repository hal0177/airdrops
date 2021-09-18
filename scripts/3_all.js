"use strict"

const fs = require("fs")
const dotenv = require("dotenv")
const ERC20 = require("ERC20")

dotenv.config()

const PK = process.env.PK
const PROVIDER = process.env.PROVIDER
const FREE_ADDR = process.env.FREE_ADDR

const data = fs.readFileSync("../prepared/correctAddresses.json")
const { FREEMOON } = JSON.parse(data)

const addresses = FREEMOON.map(entry => entry.I)

const connect = async () => {
  const web3 = new Web3(PROVIDER)
  const account = await web3.eth.accounts.privateKeyToAccount(PK)
  await web3.eth.accounts.wallet.add(account)
  const FREE = new web3.eth.Contract(ERC20, FREE_ADDR)
  return { web3, account, FREE }
}


const startRewarding = async () => {
    const { web3, account, FREE } = await connect()
    
    let current = 0
    let finalIndex = addresses.length - 1

    let success = [], fail = []
    
    const airdropping = setInterval(async () => {
        let currentBatchEnd = current + 10
        currentBatchEnd = currentBatchEnd > finalIndex ? finalIndex : currentBatchEnd
        let batchSize = currentBatchEnd - current
        let currentCopy = current
        current = currentBatchEnd + 1
        let requests = []

        for(let i = 0; i < batchSize + 1; i++) {
            requests.push(FREE.methods.transfer(addresses[currentCopy + i], web3.utils.toWei("5"), { from: account, gasPrice: web3.utils.toWei("4", "gwei") }))
        }
        
        const results = await Promise.allSettled(requests)

        const successes = results.filter(res => res.status === "fulfilled")
        const failures = results.filter(res => res.status === "rejected")
        success.concat(successes)
        fail.concat(failures)

        if(currentCopy >= finalIndex) {
            clearInterval(airdropping)
            const results = JSON.stringify({ SUCCESS: success, FAIL: fail }, null, 2)
            fs.writeFileSync("./all-results.json", results)
        }
    }, 13000)
}














