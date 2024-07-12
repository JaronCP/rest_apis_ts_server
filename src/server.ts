import express from "express";
import router from "./router";
import db from "./config/db";
import colors from 'colors';
import cors,{ CorsOptions } from "cors";
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from "./config/swagger";



//conectar a db
export async function conectDB() {
    try {
        await db.authenticate()
        db.sync()
        //console.log(colors.magenta('Conexión exitosa a la db'))
    } catch (error) {
        console.log(colors.red.bold('Hubo un error a la hora de conectar a la DB'))
    }

}
conectDB()

//Instancia de express
const server = express()

//Permitir CORS
const corsOptions : CorsOptions = {
    origin: function(origin, callback) {
        console.log(origin)
        if(origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS')) 
        }
    }
}
server.use(cors(corsOptions))


//Leer datos de formularios
server.use(express.json())

server.use(morgan('dev'))

server.use('/api/products', router)

//Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


export default server