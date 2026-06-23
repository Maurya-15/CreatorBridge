const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// CORS
app.use(
cors({
origin: true,
credentials: true,
})
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Health Check Route
app.get('/', (req, res) => {
res.status(200).json({
success: true,
message: 'CreatorBridge API is running 🚀',
});
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/influencers', require('./routes/influencers'));
app.use('/api/campaigns', require('./routes/campaigns'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/shortlist', require('./routes/shortlist'));

// Port
const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
.connect(process.env.MONGO_URI)
.then(() => {
console.log('✅ Connected to MongoDB Atlas');


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


})
.catch((err) => {
console.error('❌ MongoDB connection error:', err.message);
process.exit(1);
});
