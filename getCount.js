"use strict"

const Web3 = require("web3")

const fs = require("fs")

const data = fs.readFile("./fmn-json.json", (err, data) => {
    const { FREEMOON } = JSON.parse(data)
    let corrected = { FREEMOON: [] }
    
    for(let i = 0; i < FREEMOON.length; i++) {
        let current = FREEMOON[i]
        if(Web3.utils.isAddress(current.I)) corrected.FREEMOON.push(current)
    }
    
    write(corrected)
})

const write = corrected => {
    corrected = JSON.stringify(corrected, null, 2)
    fs.writeFileSync("./only-correct-addresses.json", corrected)
}
