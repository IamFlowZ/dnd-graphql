import fs from 'fs'
import path from 'path'

const races = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Races.json')).toString())
const languages = JSON.parse(fs.readFileSync(path.join(__dirname, '../sources/Languages.json')).toString())

export default function() {

}