"use strict"

const fs = require("fs")

const data = fs.readFileSync("../prepared/formatted.json")

const { FREEMOON } = JSON.parse(data)

console.log(FREEMOON[25016])
