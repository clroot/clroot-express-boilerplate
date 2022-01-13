import { Sequelize } from 'sequelize';
import sqlite3 from 'sqlite3';
import dotenv from 'dotenv';

dotenv.config();

let DATASOURCE_URL = process.env.DATASOURCE_URL;
let testDatabase = undefined;

if (process.env.NODE_ENV === 'test') {
  const sqlite3Database = ':memory:';

  sqlite3.verbose();
  testDatabase = new sqlite3.Database(sqlite3Database);
  DATASOURCE_URL = `sqlite:${sqlite3Database}`;
}

const sequelize = new Sequelize(DATASOURCE_URL);

export const closeDatabase = async () => {
  await sequelize.close();

  if (process.env.NODE_ENV === 'test') {
    testDatabase.close();
  }
};

export default sequelize;