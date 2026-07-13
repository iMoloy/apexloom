const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
mongoose.connect(process.env.MONGODB_URI, { dbName: "apexloom_db" })
  .then(() => { console.log("Connected successfully"); process.exit(0); })
  .catch((err) => { console.error("Connection failed", err); process.exit(1); });
