import { Request, Response } from "express";
import { PrismaClient, User } from "@prisma/client";
import {
  comparePasswords,
  generateToken,
  generateVerificationCode,
  hashPassword,
} from "../config/utils/auth";
import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "../config/utils/email";

const prisma = new PrismaClient();

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  id: string;
  email: string;
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  sex: string;
  purpose: string;
}

interface SimpleRegisterRequest {
  email: string;
  password: string;
}

interface VerificationRequest {
  email: string;
  confirmationCode: string;
}

interface UpdateUserRequest {
  fullName: string;
  dateOfBirth: string;
  nationality: string;
  country: string;
  sex: string;
  purpose: string;
}

export const authController = {
  async login(req: Request<{}, {}, LoginRequest>, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isValid = await comparePasswords(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res.status(403).json({ message: "Email not verified" });
      }

      const token = generateToken(user.id);
      const userWithoutPassword: Partial<User> = { ...user };
      delete userWithoutPassword.password;

      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async register(req: Request<{}, {}, RegisterRequest>, res: Response) {
    try {
      const {
        id, // Necesitamos el ID del usuario ya registrado
        fullName,
        dateOfBirth,
        nationality,
        country,
        sex,
        purpose,
      } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { id } });
      if (!existingUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          nationality,
          country,
          sex,
          purpose,
        },
        // Seleccionamos los campos que queremos devolver
        select: {
          id: true,
          email: true,
          fullName: true,
          dateOfBirth: true,
          nationality: true,
          country: true,
          sex: true,
          purpose: true,
          // No incluimos password ni confirmationCode
        },
      });

      // Retornamos el usuario actualizado
      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async updateUser(
    req: Request<{ id: string }, {}, UpdateUserRequest>,
    res: Response
  ) {
    try {
      const { id } = req.params;
      const { fullName, dateOfBirth, nationality, country, sex, purpose } =
        req.body;

      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          fullName,
          dateOfBirth: new Date(dateOfBirth),
          nationality,
          country,
          sex,
          purpose,
        },
      });

      const userWithoutPassword: Partial<User> = { ...updatedUser };
      delete userWithoutPassword.password;

      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async simpleRegister(
    req: Request<{}, {}, SimpleRegisterRequest>,
    res: Response
  ) {
    try {
      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already registered" });
      }

      const hashedPassword = await hashPassword(password);
      const verificationCode = generateVerificationCode();

      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          confirmationCode: verificationCode,
        },
      });

      // Generar un token fake (en producción usarías JWT.sign con una clave secreta)
      const fakeToken = Buffer.from(`${newUser.id}-${Date.now()}`).toString(
        "base64"
      );

      await sendVerificationEmail(email, verificationCode);

      // Retornar el usuario (sin el password) y el token
      const { password: _, ...userWithoutPassword } = newUser;

      res.status(201).json({
        message: "Registration successful",
        user: userWithoutPassword,
        token: fakeToken,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async confirmVerificationCode(
    req: Request<{}, {}, VerificationRequest>,
    res: Response
  ) {
    try {
      const { email, confirmationCode } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.confirmationCode !== confirmationCode) {
        return res.status(400).json({ message: "Invalid verification code" });
      }

      await prisma.user.update({
        where: { email },
        data: {
          isVerified: true,
          confirmationCode: null,
        },
      });

      res.json({ message: "Email verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async resetPassword(req: Request<{}, {}, { email: string }>, res: Response) {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const resetCode = generateVerificationCode();
      await prisma.user.update({
        where: { email },
        data: { confirmationCode: resetCode },
      });

      await sendPasswordResetEmail(email, resetCode);

      res.json({ message: "Password reset instructions sent" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },

  async getUserByEmail(
    req: Request<{}, {}, {}, { email: string }>,
    res: Response
  ) {
    try {
      const { email } = req.query;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userWithoutPassword: Partial<User> = { ...user };
      delete userWithoutPassword.password;

      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  },
};
