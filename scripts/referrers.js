"use strict"

const fs = require("fs")
const dotenv = require("dotenv")
const ERC20 = require("../ERC20")
const Web3 = require("web3")

dotenv.config()

const PK = process.env.PK
const PROVIDER = process.env.PROVIDER
const FREE_ADDR = process.env.FREE_ADDR

const data = fs.readFileSync("./prepared/sortedByRef.json")
const { FREEMOON } = JSON.parse(data)

const addresses = FREEMOON.map(entry => entry.I)

let airdropping

const connect = async () => {
  const web3 = new Web3(PROVIDER)
  const account = await web3.eth.accounts.privateKeyToAccount(PK)
  await web3.eth.accounts.wallet.add(account)
  const FREE = new web3.eth.Contract(ERC20, FREE_ADDR)
  return { web3, account, FREE }
}


const startRewarding = async () => {
    let current = 0
    let finalIndex = addresses.length - 1

    let success = [], fail = []
    
    airdropping = setInterval(async () => {
        if(current >= finalIndex) return
        console.log(`Airdropping batch starting ${ current }`)
        const { web3, account, FREE } = await connect()

        let currentBatchEnd = current + 10
        currentBatchEnd = currentBatchEnd > finalIndex ? finalIndex : currentBatchEnd
        let batchSize = currentBatchEnd - current
        let currentCopy = current
        current = currentBatchEnd + 1
        let requests = []

        for(let i = 0; i < batchSize + 1; i++) {
            requests.push(FREE.methods.transfer(addresses[currentCopy + i], web3.utils.toWei("5000")).send({
                from: account,
                gasPrice: web3.utils.toWei("4", "gwei"),
                value: web3.utils.toWei("1", "gwei")
            }))
        }
        
        const results = await Promise.allSettled(requests)

        const successes = results.filter(res => res.status === "fulfilled")
        const failures = results.filter(res => res.status === "rejected")
        success.concat(successes)
        fail.concat(failures)

        if(currentCopy >= finalIndex) {
            clearInterval(airdropping)
            const results = JSON.stringify({ SUCCESS: success, FAIL: fail }, null, 2)
            fs.writeFileSync("./results/referrers-results.json", results)
        }
    }, 13000)
}



try {
    startRewarding()
} catch(err) {
    clearInterval(airdropping)
}











