import prisma from "../connect.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

class UserController {
  async getAllUsers(req, res) {
    console.log(req.body);
    const users = await prisma.user.findMany();
    res.send(users);
  }

  getUserById(req, res) {
    res.send(`Get user by id: ${req.params.id}`);
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ user: { id: user.id, email: user.email }, token });
  }

  // Signup and then login the user
  async signup(req, res, next) {
    console.log(req.body);
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser) {
        return res.status(409).json({ message: "Email already exists." });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.status(201).json({ user: { id: user.id, email: user.email }, token });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error creating user.", error: error.message });
    }
  }

  deleteUser(req, res) {
    res.send(`Delete user: ${req.params.id}`);
  }
}

export default UserController;
