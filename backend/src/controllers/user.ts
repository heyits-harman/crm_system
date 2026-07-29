import type { Request, Response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma'
import { Role } from "../../generated/prisma/enums";

export const createUser = async (req: Request, res: Response) => {

  try{

    const body = (req.body ?? {}) as {
      name: string;
      email: string;
      password: string;
      role: Role;
    }

    const { name, email, password } = body;
    let role = body.role ?? Role.MEMBER;

    if(!name || !email || !password){   
      return res.status(400).json({ error: "INVALID_REQUEST" });
    }                                                     
    
    //Find User
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      }
    })

    if (existingUser !== null){
      return res.status(400).json({error:"Email already exists!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    //Create New User
    const newUser = await prisma.user.create({
      data:{
        name: name,
        email: email,
        password: hashedPassword,
        role: role,
      }
    });

    res.status(201).json({ message: "User Created", user: newUser })

  } catch(err: any){
    console.error("Registration Error: ", err.message);
    res.status(500).json({ error: "Server error during registration" })
  }

}

export const loginUser = async (req: Request, res: Response) => {
  try{

    const body = (req.body ?? {}) as {
      email: string;
      password: string;
    }

    const { email, password } = body;

    //Find User
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
        role: true,
        password: true
      }
    })

    if(!user){
      return res.status(400).json({error: "User is not registered!"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
     return res.status(400).json({error: "Invalid password!"});
    }

    const token = jwt.sign({id: user.id, role: user.role}, process.env.ACCESS_TOKEN!, {expiresIn: "1d"});
      res.json({message: 'Login Succesfully', token});

  } catch(err: any){
     console.error("Login Error: ", err.message);
    res.status(500).json({error: "Server error during login"});
  }
}