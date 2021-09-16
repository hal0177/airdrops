"use strict"

const fs = require("fs")

const data = fs.readFileSync("../prepared/original.json")

const { FREEMOON } = JSON.parse(data)

console.log(FREEMOON.length)

const headerRemoved = FREEMOON.slice(1)

console.log(headerRemoved.length)

const formatted = JSON.stringify({ FREEMOON: headerRemoved }, null, 2)

fs.writeFileSync("../prepared/formatted.json", formatted)
