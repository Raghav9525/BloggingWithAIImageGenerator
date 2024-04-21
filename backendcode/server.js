const express = require('express');
const cors = require('cors');
const app = express();
PORT = process.env.PORT || 5000
const path = require('path'); // Import the path module

const blogRoutes = require('./routes/blog')
const authRoutes = require('./routes/auth')

app.use(express.json());
app.use(cors({
    origin: "*" // Allow all origins
}));

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/',blogRoutes);

app.use('/auth',authRoutes);


app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
