import express from 'express';
import {connectDB} from './config/database.js'
import bodyParser from 'body-parser';
import apiRoutes from './routes/index.js'
import cors from 'cors'
import { PORT } from './config/serverConfig.js';
const app = express();


// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(cors())
app.use('/api', apiRoutes)
app.listen(PORT, async ()=>{
    console.log("server started at port", PORT);
    await connectDB();
    console.log("Mongodb connect");
})