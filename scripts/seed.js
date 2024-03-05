const { db } = require('@vercel/postgres');
const {
    ingredients,
  } = require('../src/lib/placeholder-data.js');


async function seedIngredients(client) {
    try {
      await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
      
      // Create the "ingredients" table if it doesn't exist
      const createTable = await client.sql`
        CREATE TABLE IF NOT EXISTS ingredients (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          per TEXT NOT NULL,
          gPerItem NUMERIC(10,1) NOT NULL,
          calories NUMERIC(10,0),
          proteins NUMERIC(10,1),
          carbs NUMERIC(10,1),
          fats NUMERIC(10,1)
        );
      `;
  
      console.log(`Created "ingredients" table`);
  
      // Insert data into the "ingredients" table
      const insertedIngredients = await Promise.all(
        ingredients.map(
          (ingredient) => client.sql`
          INSERT INTO ingredients (id, name, per, gPerItem, calories, proteins, carbs, fats)
          VALUES (${ingredient.id}, 
                  ${ingredient.name}, 
                  ${ingredient.per},
                  ${ingredient.gPerItem}, 
                  ${ingredient.calories},
                  ${ingredient.proteins}, 
                  ${ingredient.carbs},
                  ${ingredient.fats})
          ON CONFLICT (id) DO NOTHING;
        `,
        ),
      );
  
      console.log(`Seeded ${insertedIngredients.length} ingredients`);
  
      return {
        createTable,
        ingredients: insertedIngredients,
      };
    } catch (error) {
      console.error('Error seeding ingredients:', error);
      throw error;
    }
  }

  async function main() {
    const client = await db.connect();
  
    await seedIngredients(client);
  
    await client.end();
  }
  
  main().catch((err) => {
    console.error(
      'An error occurred while attempting to seed the database:',
      err,
    );
  });