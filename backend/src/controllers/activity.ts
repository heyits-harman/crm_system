import type { Request, Response } from "express";
import { prisma } from '../../lib/prisma';

export const getActivity = async (req: Request, res: Response) => {

  try{

    const param = (req.params ?? {}) as {
      id: string
    }
    const { id: leadId } = param;

    const activity = await prisma.activity.findMany({
      where: {
        leadId: leadId
      },
      include: {
        user: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json({
      success: true,
      activity
    })

  } catch(err){
    console.error(err);
    res.status(500).json({
      success: true, 
      message: "Failed to fetch acitivity"
    })
  }

}