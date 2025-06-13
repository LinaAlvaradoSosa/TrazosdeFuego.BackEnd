import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv()

export default function tokenverification(req, res, next) {
    try {
        let KEY = process.env.SEGURITYKEY
        let token = req.headers.authorization
        token = token.split(' ')[1]
        jwt.verify(token, KEY, (error, decode)=>{
            if (error) {
                res.status(400).send({error: "Token invalido"})
            } else {
                req.admin=decode
                next()
            }
        })
    } catch (error) {
        console.log(error);
        res.status(500).snd({error: "Error, problema con el token "})
    }
}