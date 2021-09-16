"use strict"

const fs = require("fs")

const data = fs.readFileSync("../prepared/correctAddresses.json")
const { FREEMOON } = JSON.parse(data)
const candidateCount = FREEMOON.length

let winners = []
winners.push(FREEMOON[25016])

const getRandom = () => {
  return Math.floor(Math.random() * (candidateCount - 1))
}

for(let i = 0; i < 1999; i++) {
    let currentId = getRandom()
    while(winners.includes(FREEMOON[currentId])) {
      currentId = getRandom()
    }
    winners.push(FREEMOON[currentId])
}

console.log("Winners list length: ", winners.length)

winners = JSON.stringify({ FREEMOON: winners }, null, 2)

fs.writeFileSync("../prepared/randomWinners.json", winners)

