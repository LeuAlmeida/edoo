import { Sequelize } from 'sequelize';
import path from 'path';

const getDbConfig = () => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'test':
      return {
        dialect: 'sqlite' as const,
        storage: ':memory:',
        logging: false,
      };

    case 'production':
      return {
        dialect: 'sqlite' as const,
        storage: path.resolve('/app/data/database.sqlite'),
        logging: false,
      };

    default: // development
      return {
        dialect: 'sqlite' as const,
        storage: path.resolve(__dirname, '../../../database.sqlite'),
        logging: console.log,
      };
  }
};

if (process.env.NODE_ENV === 'development') {
  const fs = require('fs');
  const dbPath = path.resolve(__dirname, '../../../database.sqlite');
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }
}

export const sequelize = new Sequelize(getDbConfig());

import '../database/models/Benefit';

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Ensure data directory exists in production
    if (process.env.NODE_ENV === 'production') {
      const fs = require('fs');
      const dataDir = '/app/data';
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
    }

    await sequelize.authenticate();
    await sequelize.sync({ force: process.env.NODE_ENV === 'development' });
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Unable to initialize database:', error);
    throw error;
  }
};
