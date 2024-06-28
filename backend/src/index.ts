import express from 'express';
import bodyParser from 'body-parser';
import loginRouter from './api/login';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.use('/api', loginRouter);


const PORT = 8888;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
