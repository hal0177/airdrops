"use strict"

const fs = require("fs")


fs.readFile("./only-correct-addresses.json", (err, data) => {
    const { FREEMOON } = JSON.parse(data)
    console.log(FREEMOON.length)
})

fs.readFile("./fmn-json.json", (err, data) => {
    const { FREEMOON } = JSON.parse(data)
    console.log(FREEMOON.length)
})
