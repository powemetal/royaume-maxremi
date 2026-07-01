import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

export const monstres = axios.create({
    baseURL: process.env.MONSTRES_API || "https://www.dnd5eapi.co/api/2014/monsters/",
    timeout: 5000,
})