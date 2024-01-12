const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3555;
const secretKey = 'sewserFSWERFGGFersfgwsergfeWRFGwseEF3434345TERt'; // Change this to a secure secret key

// Middleware to parse JSON
app.use(bodyParser.json());
app.use(cors());

// Dummy user for demonstration purposes
const dummyUser = {
  username: 'user123',
  password: 'password123'
};

const checkToken = (req, res, next) => {
    let token = req.header("Authorization");
    token = token.slice(7)
    console.log("Token from check", token)


    if (!token) {
        return res.status(401).json({error: "Unauthorized - Token missing"});
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorised - Invalid Token"})
    }
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password match the dummy user
  if (username === dummyUser.username && password === dummyUser.password) {
    // Generate a JWT token
    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

    // Send the token as a response
    res.json({ token });
  } else {
    // Return unauthorized if credentials are invalid
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.get("/dashboard", checkToken, (req, res) => {
    const { username } = req.user;
    res.json({ message: `Welcome to the dashboard, ${username}!`})
})


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
