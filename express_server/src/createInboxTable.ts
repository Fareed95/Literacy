import pool from './db';

export const createInboxTable = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS inbox (
      id SERIAL PRIMARY KEY,
      requested_email VARCHAR(255) NOT NULL,
      user_email VARCHAR(255) NOT NULL
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Inbox table created successfully.');
  } catch (error) {
    console.error('Error creating the inbox table:', error);
  }
};

createInboxTable();
