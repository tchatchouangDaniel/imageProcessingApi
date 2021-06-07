/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import router from './routes/index';

const app = express();
const port = 3000;

app.use(morgan('common'));
app.use(helmet());
app.use('/api', router);

export default app;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server running on http://localhost:${3000}/api`);
});
