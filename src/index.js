import dotenv from 'dotenv';
import app from './main';
import sequelize from './database';
import { syncAllModel } from './models';

dotenv.config();

export const startServer = async (port = process.env.PORT || 4000, callback = undefined) => {
  if (process.env.NODE_ENV === 'test') {
    port = 0;
  }

  await sequelize.authenticate();
  await syncAllModel();

  const server = await app.listen(port);

  return callback ? callback(server) : Promise.resolve(server);
};


startServer().then((server) => {
  console.log(`Server is started on port ${server.address().port}`);
});