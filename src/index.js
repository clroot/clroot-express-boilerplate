import dotenv from 'dotenv';
import app from './main';
import sequelize, { closeDatabase } from './database';
import { syncAllModel } from './models';

dotenv.config();

/**
 * @async
 * @function start application server
 * @param {number} port=4000
 * @param {function} callback=undefined
 * @return {Promise<import('http').Server>}
 * */
export const startServer = async (port = process.env.PORT || 4000, callback = undefined) => {
  if (process.env.NODE_ENV === 'test') {
    port = 0;
  }

  await sequelize.authenticate();
  await syncAllModel();

  const server = await app.listen(port);

  return callback ? callback(server) : Promise.resolve(server);
};

export const closeServer = async (server, callback = undefined) => {
  await closeDatabase();
  await server.close();
  return callback ? callback() : Promise.resolve();
};


startServer().then((server) => {
  console.log(`Server is started on port ${server.address().port}`);
});