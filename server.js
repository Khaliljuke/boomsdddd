import express, { json } from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/error-handler.js';
import dotenv from 'dotenv'

// Routes import
import userRoutes from './routes/User.js'
import generateRoute from './routes/classRoute.js'
import entityRoute from './routes/EntityRoute.js'
import draftRoute from './routes/draftRoute.js'

const app = express();
const port = process.env.PORT || 9090;
dotenv.config();

const databaseName = 'CodeMagician';

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

 //Database connection
 mongoose
   .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
   .then(() => {
     console.log(`Connected to ${databaseName}`);
   })
   .catch(err => {
     console.log(err);
   });


/*mongoose
  .connect(`mongodb+srv://Hassen:Hassen1998@cluster0.gube3xx.mongodb.net/CodeMagician?retryWrites=true&w=majority`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });*/

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/img',express.static('img'))


//app.use(notFoundError);
app.use(errorHandler);

app.set('view engine', 'ejs');


// Add routes
app.use('/user', userRoutes);
app.use("/generate", generateRoute)
app.use("/entity", entityRoute)
app.use("/draft", draftRoute)

// Server connection 
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})





