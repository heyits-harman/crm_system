import type { Request, Response } from "express";
import { prisma } from '../../lib/prisma';
import { LeadStatus, ActivityType } from "../../generated/prisma/enums";

export const createLead = async (req: Request, res: Response) => {

  try{

    const body = (req.body ?? {}) as {
      name: string,
      email: string,
      phone?: string,
      company?: string,
      message?: string,
      status: LeadStatus
    }

    const { name, email, phone, company, message } = body;
    let status = body.status ?? LeadStatus.NEW;

    if(!name || !email){   
        return res.status(400).json({ error: "INVALID_REQUEST" });
    } 
    
    const newLead = await prisma.lead.create({
      data:{
        name: name,
        email: email,
        phone: phone ?? null,
        company: company ?? null,
        message: message ?? null,
        status: status
      }
    });
    return res.status(201).json(newLead);

  }catch(error){
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create Lead",
    });
  }

}

export const getLeads = async (req: Request, res: Response) => {

   try {
    const user = req.user;
    if(!user?.id){
      throw new Error("USER_ID_MISSING");
    }

    // Pagination
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Number(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    // Filters
    const status = req.query.status as LeadStatus | undefined;
    const search = req.query.search as string | undefined;
    const assignedToId = req.query.assignedToId as string | undefined;

    // Sorting
    const sortBy = (req.query.sortBy as string) || "createdAt";
    const order = req.query.order === "asc" ? "asc" : "desc";

    const where: any = {};

    // Members can only see their own leads
    if (user.role === "MEMBER") {
      where.assignedToId = user.id;
    }

    // Admin can filter by assigned user
    if (user.role === "ADMIN" && assignedToId) {
      where.assignedToId = assignedToId;
    }

    // Status filter
    if (status) {
      where.status = status;
    }

    // Search by name, email or company
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          company: {
            contains: search,
            mode: "insensitive",
          },
        },
      ];
    }

    //Whitelisting Sortable fields
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "status",
      "name",
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,

        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },

        orderBy: {
          [sortField]: order,
        },
      }),

      prisma.lead.count({
        where,
      }),
    ]);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      data: leads,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch leads",
    });
  }

}

export const updateLead = async (req: Request, res: Response) => {
  try {

    const param = (req.params ?? {}) as {
      id: string
    }

    const body = (req.body ?? {}) as {
      name?: string,
      email?: string,
      phone?: string,
      company?: string,
      message?: string,
      status?: LeadStatus,
      assignedToId?: string
    }

    const { id } = param;
    const user = req.user;
      if(!user?.id){
        throw new Error("USER_ID_MISSING");
      }
    const { name, email, phone, company, message, status, assignedToId } = body;

    // Execute all read/write database operations inside tx
    const updatedLead = await prisma.$transaction(async (tx) => {
      
      // 1. Check if lead exists
      const lead = await tx.lead.findUnique({
        where: { id },
      });

      if (!lead) {
        throw new Error("NOT_FOUND");
      }

      // 2. Check permission for MEMBER role
      if (user.role === "MEMBER" && lead.assignedToId !== user.id) {
        throw new Error("FORBIDDEN");
      }

      // 3. Check updated fields
      const updateData: any = {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
        ...(company !== undefined && { company }),
        ...(message !== undefined && { message }),
        ...(status !== undefined && { status }),
        ...(assignedToId !== undefined && { assignedToId }),
      };

      if (Object.keys(updateData).length === 0) {
        throw new Error("NO_FIELDS_TO_UPDATE");                             //Throw Error if none field is updated
      }

      // 4. Update the lead
      const updated = await tx.lead.update({
        where: { id },
        data: updateData,
        include: {
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      // 5. Log activity if status changed
      if (status && status !== lead.status) {
        await tx.activity.create({
          data: {
            type: ActivityType.STATUS_CHANGED,
            description: `Status changed from ${lead.status} to ${status}`,
            lead: { connect: { id: lead.id } },
            user: { connect: { id: user.id } },
          },
        });
      }

      // 6. Log activity if assignment changed
      if (assignedToId && assignedToId !== lead.assignedToId) {
        const assignee = await tx.user.findUnique({
          where: { id: assignedToId },
          select: { name: true },
        });

        await tx.activity.create({
          data: {
            type: ActivityType.ASSIGNED,
            description: `Lead assigned to ${assignee?.name ?? "unknown"}`,
            lead: { connect: { id: lead.id } },
            user: { connect: { id: user.id } },
          },
        });
      }

      return updated;
    });

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error: any) {
    console.error(error);

    // Handle custom thrown errors from inside the transaction
    if (error.message === "NOT_FOUND") {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    if (error.message === "FORBIDDEN") {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this lead",
      });
    }

    if (error.message === "NO_FIELDS_TO_UPDATE") {
      return res.status(400).json({
        success: false,
        message: "You must update atleast one field",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update lead",
    });
  }
}

export const deleteLead = async (req: Request, res: Response) => {
  try {

    const param = (req.params ?? {}) as {
      id: string
    }

    const { id } = param;
    const user = req.user;

    // Only admins can delete
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete leads",
      });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found",
      });
    }

    await prisma.lead.delete({
      where: {
        id,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
    
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete lead",
    });
  }
}