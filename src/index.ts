import express from 'express';
import router from './routes/api';
import bodyParser from 'body-parser';
import db from './utils/database';
import docs from './docs/route';
import cors from 'cors';

async function init() {
  try {
    const dbStatus = await db();
    console.log('db status: ', dbStatus);

    const app = express();
    const PORT = 3000;

    app.use(cors());
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.get('/', (req, res) => {
      res.status(200).send('<h1>Hello World</h1>`');
    });

    app.use('/api', router);
    docs(app);

    app.listen(PORT, () => {
      console.log(`⚡[server] Server is running at http://localhost:${PORT}`);
      console.log(
        `⚡[server] Swagger is running at http://localhost:${PORT}/api-docs`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

init();
