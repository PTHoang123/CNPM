import pool from "./db.js";
import products from "./productsData.js";

async function seed() {
  for (const p of products) {
    await pool.query(
      `INSERT INTO products 
        (product_code,title,price,image01,image02,image03,category,description)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (product_code) DO NOTHING`,
      [
        p.product_code,
        p.title,
        p.price,
        p.image01,
        p.image02,
        p.image03,
        p.category,
        p.description,
      ]
    );
  }
  console.log("✅ Seed complete");
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});