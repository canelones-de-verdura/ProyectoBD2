import express, { Request, Response } from "express";

const app = express()
const port = 3000
app.get('/', (req: Request, res: Response) => {
    res.send("Hola")
})

app.listen(port, () => {
    console.log(`Cuchando en ${port}`)
})

