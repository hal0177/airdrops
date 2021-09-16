"use strict"

const fs = require("fs")

const data = fs.readFileSync("../prepared/correctAddresses.json")
let { FREEMOON } = JSON.parse(data)

let sortedByRef = FREEMOON.sort((firstEl, secondEl) => {
    if(firstEl.J < secondEl.J) return 1
    else if(firstEl.J > secondEl.J) return -1
    else return 0
})

sortedByRef = sortedByRef.slice(0, 200)
console.log(sortedByRef.length)

sortedByRef = JSON.stringify({ FREEMOON: sortedByRef }, null, 2)

fs.writeFileSync("../prepared/sortedByRef.json", sortedByRef)
