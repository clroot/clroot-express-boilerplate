import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

let DATASOURCE_URL = process.env.DATASOURCE_URL;
let testDatabase = undefined;

if (process.env.NODE_ENV === 'test') {
  testDatabase = new sqlite3.Database(':memory:');
  DATASOURCE_URL = 'sqlite::memory:';
}

const sequelize = new Sequelize(DATASOURCE_URL);
export const closeServer = async () => {
  await sequelize.close();

  if (process.env.NODE_ENV === 'test') {
    testDatabase.close();
  }
};

export default sequelize;