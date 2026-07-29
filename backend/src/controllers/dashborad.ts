import type { Request, Response } from "express";
import { prisma } from '../../lib/prisma';
import { Role } from "../../generated/prisma/enums";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === Role.ADMIN;

    // Filter leads: Admin sees all, Member sees assigned leads only
    const where = isAdmin ? {} : { assignedToId: userId };

    // Get total count & count by status in parallel
    const [totalLeads, statusCounts] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.groupBy({
        by: ["status"],
        where,
        _count: true,
      }),
    ]);

    // Format response into a clean key-value object
    const stats: Record<string, number> = { totalLeads };
    statusCounts.forEach((item) => {
      stats[item.status.toLowerCase()] = item._count;
    });

    return res.status(200).json({ 
      success: true, 
      data: stats
    });
    
  } catch (err) {
    console.error(err)
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};