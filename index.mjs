import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from "./config/db.mjs";
import authRoutes from "./routes/authRoutes.mjs"
import cors from "cors";
import { createServer } from 'http';
import { Server } from 'socket.io';
import { pipeline } from '@xenova/transformers';
import { readFileSync } from 'fs';

//config env
dotenv.config();

//database config
connectDB();


//rest objest
const app = express();


//middleware
app.use(cors());
app.use(express.json()); 
app.use(morgan('dev'));

//routes
app.use('/api/v1/auth',authRoutes);

//rest api  
app.get('/',(req, res) =>{
    res.send("<h1>welcome to website</h1>");
});

//port
const port= process.env.port;

//run listen
// app.listen(port,()=>{
//     console.log(`server is running on ${process.env.dev_mode} on port ${port}`.bgGreen.white);
// });

const server = createServer(app);
const data = readFileSync('./data/data_jis.txt').toString();
const welcome = { answer: "Hey, I'm AdmitWise a chatbot. I've some knowledge on educational department. You can consult with me on educational perspective and based on my knowledge I'll try to assist you.", score: 0.9999999999999999 };

pipeline('question-answering', 'Xenova/distilbert-base-uncased-distilled-squad').then(bot => {
    new Server(server, {
        cors: {
            origin: '*',
            optionsSuccessStatus: 200
        }
    }).on('connection', ws => {
        ws.emit('answer', welcome);
        ws.on('question', question => {
            bot(question, data).then(answer => {
                // if(answer.score < 0.05) answer.answer = "I don't have sufficient information!";
                console.log(answer.score);
                ws.emit('answer', answer);
            })
        })
    })
})

server.listen(port, () => {
    console.log('Server is running!');
})