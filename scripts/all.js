"use strict"

const fs = require("fs")

const data = fs.readFileSync("../prepared/correctAddresses.json")
const { FREEMOON } = JSON.parse(data)

const addresses = FREEMOON.map(entry => entry.I)

const connect = async () => {
  const web3 = new Web3(PROVIDER)
  const account = 
}