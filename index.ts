import express, { Express } from 'express';
import dotenv from 'dotenv';
import http from 'http';
import mongoose from 'mongoose';
import tokensController, {task} from './controller/tokensController';
dotenv.config();
const app: Express = express();
const PORT = process.env.PORT || 8000;
const DATABASE = process.env.DATABASE;
const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.PASSWORD;
const MONGO_BASE_URL = process.env.BASE_URL;
const MONGO_URL = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_BASE_URL}/${DATABASE}`
let server: http.Server;

mongoose.set('strictQuery', true);

app.use(express.json());
app.use(tokensController)

mongoose.connect(MONGO_URL).then(() => {
  console.log('database connected')
  server = app.listen(PORT, () => { console.log('listening on', PORT) });
  task.start();
  console.log("Job started");
})

process.on('SIGINT', () => {
  console.log('Received SIGINT. Exiting.');
  mongoose.disconnect()
  console.log('disconnected mongoose');
  task.stop()
  console.log('shut down cron');
  process.exit();
});

app.on('close', () => {
  console.log("Server is closed!")
  task.stop()
  console.log('shut down cron');
  mongoose.disconnect()
  console.log('disconnected mongoose');
});

mongoose.connection.on('error', (err) => {
  console.log(`Mongoose default connection error: ${err}`);
  task.stop()
  console.log('shut down cron');
  server.close(() => {
    console.log('Http server closed');
  });
});