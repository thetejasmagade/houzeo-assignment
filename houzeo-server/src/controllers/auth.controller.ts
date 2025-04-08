import { Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authForm = (req: Request, res: Response): any => {
    const { username, password } = req.body;
  
    const envUsername = process.env.AUTH_USERNAME;
      const envPassword = process.env.AUTH_PASSWORD;
    
  
    if (username !== envUsername || password !== envPassword) {
      return res.status(401).json({
        message: 'Invalid credentials',
      });
    }
  
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET as string,
      {
        expiresIn: process.env.JWT_EXPIRES_IN as string,
      }
    );
  
    return res.status(200).json({
      message: 'Authenticated successfully',
      token,
    });
  };
  
  