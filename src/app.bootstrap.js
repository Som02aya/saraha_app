
import { NODE_ENV, port } from '../config/config.service.js'
import { authRouter, userRouter } from './modules/index.js'
import express from 'express'
import {connectdb} from './DB/index.js'
import cors from 'cors'
async function bootstrap() {
    const app = express()
    //convert buffer data
    app.use(cors(),express.json())
    app.use(express.urlencoded({ extended: true }));
    await connectdb();
    //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)


    //invalid routing
    app.use('{/*dummy}', (req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use((error, req, res, next) => {
        const status = error.cause?.status ?? 500
        return res.status(status).json({
            error_message:
                status == 500 ? 'something went wrong' : error.message ?? 'something went wrong',
            stack: NODE_ENV == "development" ? error.stack : undefined
        })
    })
    
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}
export default bootstrap