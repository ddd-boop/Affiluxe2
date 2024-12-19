import bcrypt from 'bcryptjs'; // To hash the password
import { MongoClient } from 'mongodb'; // To interact with the database
import jwt from 'jsonwebtoken'; // For JWT token generation

const DB_URI = process.env.DB_URI; // MongoDB URI
const JWT_SECRET = process.env.JWT_SECRET; // JWT secret

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Connect to the MongoDB database
      const client = new MongoClient(DB_URI);
      await client.connect();
      const db = client.db('your-database'); // Replace with your database name
      const usersCollection = db.collection('users');

      // Check if the email already exists in the database
      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ error: 'Email already exists.' });
      }

      // Insert the user into the database
      const result = await usersCollection.insertOne({
        email,
        password: hashedPassword,
      });

      // Generate a JWT token for the new user
      const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '1h' });

      // Send the success response with the JWT token
      res.status(201).json({ message: 'User created successfully', token });

    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error.' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
