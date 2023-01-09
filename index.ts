import express, { Express} from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const app: Express = express();
const PORT = process.env.PORT||8000;
const DATABASE=process.env.DATABASE;
const MONGO_USER=process.env.USER;
const MONGO_PASSWORD=process.env.PASSWORD;
const MONGO_BASE_URL=process.env.BASE_URL;
const MONGO_URL=`mongodb+srv://admin:G%40nWe1Lun%4094@shoreasg-cluster.7qwwc.mongodb.net/ZilWorld`

mongoose.set('strictQuery', true);
mongoose.connect(MONGO_URL).then(()=>{
  console.log('database connected')
  app.listen(PORT, () => { console.log('listening on', PORT) });
})