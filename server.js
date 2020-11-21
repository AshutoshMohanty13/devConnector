const express = require('express');
const app = express();
//this will look for an environment variable called port when its deployed and on local it will run on port no. 5000.
const PORT = process.env.PORT || 5000; 

app.get('/', (req, res) => res.send('API Running'));

app.listen(PORT, () => console.log(`Server started on ${PORT}`));