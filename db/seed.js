const {
    client,
    getAllUsers,
    createUser // new
  } = require('./index');

async function testDB() {
  try {
    // connect the client to the database, finally
    console.log("Starting to test database...");

    // queries are promises, so we can await them
    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  } 
}

async function dropTables() {
    try{
        console.log("Starting to drop tables...");
        await client.query(`
        DROP TABLE IF EXISTS users;
        `);

        console.log("Finished dropping tables!");
    }catch(error){
        console.error("Error dropping tables!");
        throw error;
    }
}

async function createTables() {
    try{
        console.log("Starting to build tables...");
        await client.query(`
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            username varchar(255) UNIQUE NOT NULL,
            password varchar(255) NOT NULL
          );
        `);
        console.log("Finished building tables!");
    }catch(error){
        console.error("Error building tables!");
        throw error;
    }
}

async function rebuildDB() {
    try {
      client.connect();
  
      await dropTables();
      await createTables();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());