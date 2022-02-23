import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';
import logger from '/logger';

dotenv.config();

let DATASOURCE_URL = process.env.DATASOURCE_URL;
let testDatabase = undefined;

if (process.env.NODE_ENV === 'test' || !DATASOURCE_URL) {
  const sqlite3Database = ':memory:';

  sqlite3.verbose();
  testDatabase = new sqlite3.Database(sqlite3Database);
  DATASOURCE_URL = `sqlite:${sqlite3Database}`;
}

const sequelize = new Sequelize(DATASOURCE_URL, {
  logging: (message) => logger.debug(message),
});

export const closeDatabase = async () => {
  await sequelize.close();

  if (testDatabase) {
    testDatabase.close();
  }
};

export default sequelize;