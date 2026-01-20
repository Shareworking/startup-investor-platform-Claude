require('dotenv').config();
const User = require('./models/User');
const Startup = require('./models/Startup');

async function initDatabase() {
  try {
    console.log('📍 Database URL:', process.env.DATABASE_URL ? 'Loaded ✅' : 'NOT LOADED ❌');
    console.log('🔄 Creating database tables...');
    
    await User.createTable();
    console.log('✅ Users table created');
    
    await Startup.createTable();
    console.log('✅ Startups tables created');
    
    console.log('✅ All database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

initDatabase();
