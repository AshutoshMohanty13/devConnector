const express = require('express');
const app = express();

const connectDB = require('./config/database');
connectDB();

//Init middleware
app.use(express.json({ extended: false }));


app.get('/', (req, res) => res.send('API Running'));

// //Define routes
app.use('/api/users', require('./routes/api/users') );
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));


const PORT = process.env.PORT || 5000;//this will look for an environment variable called port when its deployed and on local it will run on port no. 5000.

app.listen(PORT, () => console.log(`Server started on ${PORT}`));