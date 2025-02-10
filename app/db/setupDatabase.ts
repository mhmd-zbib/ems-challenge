import { getDB } from "./getDB";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  try {
    const db = await getDB();
    
    // Read the SQL setup file
    const setupSQL = fs.readFileSync(
      path.join(__dirname, 'setup.sql'),
      'utf8'
    );

    // Split the SQL into individual statements
    const statements = setupSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await db.exec(statement);
    }

    console.log('Database setup completed successfully');
    await db.close();
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

// Run the setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase }; 