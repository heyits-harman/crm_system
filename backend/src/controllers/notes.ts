import type { Request, Response } from "express";
import { prisma } from '../../lib/prisma';
import { Role } from "../../generated/prisma/enums";

export const createNote = async (req: Request, res: Response) => {
  try{
    const body = (req.body ?? {}) as {
      content: string
    }
    const param = (req.params ?? {}) as {
      id: string
    }

    const user = req.user;
    const { content } = body;
    const { id: leadId } = param;
    const authorId = user.id;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId }
    })

    if(user.role !== Role.ADMIN && lead?.assignedToId !== user.id){
      res.status(403).json("Only Admin can create notes on unassigned leads")
    }

    const newNote = await prisma.note.create({
      data: {
        content: content,
        leadId: leadId,
        authorId: authorId
      }
    })

    return res.status(201).json(newNote);

  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false, 
      message: "Failed to create note"
    })
  }
}

export const getNote = async (req: Request, res: Response) => {
  try{

    const param = (req.params ?? {}) as {
      id: string
    }
    const { id } = param;

    const lead = await prisma.lead.findUnique({
      where: { id: id }
    })

    const user = req.user;
    if(user.role !== Role.ADMIN && lead?.assignedToId !== user.id){
      res.status(403).json("Only Admin can create notes on unassigned leads")
    }

    const notes = await prisma.note.findMany({
      where: { 
        leadId: id 
      },
      orderBy: {
        createdAt: "desc"
      }
    })

    res.status(200).json({success: true, notes});

  }catch(err){
    console.error(err);
    res.status(500).json({
      success: true, 
      message: "Failed to fetch notes"
    })
  }
}

export const deleteNote = async (req: Request, res: Response) => {
  try{

    const param = (req.params ?? {}) as {
      id: string
    }
    const { id: noteId } = param;

    const userRole = req.user.role;
    if(userRole !== Role.ADMIN){
      res.status(403).json({
        success: false,
        message: "Only Admins are allowed to delete a note"});
    }

    await prisma.note.delete({
      where: { id: noteId }
    })

    res.status(200).json({
      success: true,
       message: "Note deleted successfully"
    })

  }catch(err){
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete note"
    })
  }
}