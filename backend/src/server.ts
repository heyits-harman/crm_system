import express from 'express';
import authValidation from './middleware/auth'
import userRoutes from './route/userRoutes'
import leadsRoutes from './route/leadsRoutes'
import dashboradRoutes from './route/dashboardRoute'
import type { Request, Response } from "express";
import { prisma } from '../lib/prisma'

const app = express();
const port = 3000;

app.use(express.json());

app.use('/users', userRoutes);
app.use('/leads', authValidation, leadsRoutes);
app.use('/dashborad', authValidation, dashboradRoutes);

app.get('/health', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.status(200).json({message: "All Good!", User: users})
})

app.listen(port, async () => {
  console.log(`Server is runnig on port ${port}`)
})