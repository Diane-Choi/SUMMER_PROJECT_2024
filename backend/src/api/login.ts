import express from 'express';
import jwt from 'jsonwebtoken';
import { findUserByEmail, verifyPassword } from '../database/users';

const router = express.Router();
const accessSecret = 'access-secret';


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email)

    if (!user) {
      res.status(401).json({ message: 'Cannot find the email' });
    }

    const isMatch = await verifyPassword(email, password)
    if (isMatch && user) {
      const accessToken = jwt.sign({ name: user.name, uuid: user.userId }, accessSecret, { expiresIn: '1h' });
      res.json({ accessToken, name: user.name, uuid: user.userId, email: user.email });
    } else {
      res.status(401).json({ message: 'Password is not correct' });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error" });
  }
});

export default router;
