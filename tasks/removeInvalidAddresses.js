"use strict"

const fs = require("fs")
const Web3 = require("web3")

const data = fs.readFileSync("../prepared/formatted.json")
let { FREEMOON } = JSON.parse(data)

console.log("All: ", FREEMOON.length)

let valid = []

for(let i = 0; i < FREEMOON.length; i++) {
    let currentAddr = FREEMOON[i].I
    if(!currentAddr) {
      continue
    } else if(Web3.utils.isAddress(currentAddr)) {
      valid.push(FREEMOON[i])
    } else if(!Web3.utils.isHexStrict(currentAddr) && Web3.utils.isHex(currentAddr) && currentAddr.length === 40) {
        FREEMOON[i].I = "0x" + currentAddr
        valid.push(FREEMOON[i])
    }
}

valid = { FREEMOON: valid }

const correctAddresses = JSON.stringify(valid, null, 2)

console.log("Corrected length: ", valid.FREEMOON.length)

fs.writeFileSync("../prepared/correctAddresses.json", correctAddresses)

