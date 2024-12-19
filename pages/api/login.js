import bcrypt from 'bcryptjs'; // For comparing the password
import { MongoClient } from 'mongodb'; // To interact with the database
import jwt from 'jsonwebtoken'; // For generating JWT token

const DB_URI = process.env.DB_URI; // MongoDB URI
const JWT_SECRET = process.env.JWT_SECRET; // JWT secret

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      // Connect to the MongoDB database
      const client = new MongoClient(DB_URI);
      await client.connect();
      const db = client.db('your-database'); // Replace with your database name
      const usersCollection = db.collection('users');

      // Find the user by email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Compare the entered password with the stored hashed password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid credentials.' });
      }

      // Generate a JWT token for the user
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

      // Send the success response with the JWT token
      res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
