// Import necessary modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

// Create an Express app
const app = express();

// Set up middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Change to true if using HTTPS
}));

// Route for handling user login
app.post('/loginUser', (req, res) => {
  // Authenticate user (replace this with your actual authentication logic)
  const { email, password } = req.body;
  if (email === 'user@example.com' && password === 'password') {
    req.session.user = email; // Store user information in session upon successful login
    res.redirect('/profile'); // Redirect to profile page after successful login
  } else {
    res.redirect('/?message=invalid'); // Redirect back to login page with an error message
  }
});

// Route for handling user logout
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/?message=logout'); // Redirect to login page after logout
  });
});

// Route for rendering the login page
app.get('/', (req, res) => {
  // Check if a login status message is present in the query parameters
  const message = req.query.message;
  res.render('login', { message: getMessage(message) });
});

// Middleware to check if the user is authenticated
function requireLogin(req, res, next) {
  if (req.session && req.session.user) {
    next(); // User is authenticated, continue with the request
  } else {
    res.redirect('/?message=loginFirst'); // User is not authenticated, redirect to login page with a message
  }
}

// Route for rendering the profile page
app.get('/profile', requireLogin, (req, res) => {
  res.render('profile', { user: req.session.user });
});

// Function to get the appropriate message based on the query parameter
function getMessage(messageType) {
  switch (messageType) {
    case 'invalid':
      return { title: 'Invalid Credentials', text: 'Invalid email or password. Please try again.', icon: 'error' };
    case 'logout':
      return { title: 'Logged Out Successfully', text: 'You have been logged out.', icon: 'success' };
    case 'loginFirst':
      return { title: 'Login Required', text: 'You need to log in to access this page.', icon: 'info' };
    case 'newRegister':
      return { title: 'Registration Successful', text: 'Please log in using your credentials.', icon: 'success' };
    default:
      return null;
  }
}

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
