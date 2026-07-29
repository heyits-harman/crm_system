import type { Request, Response } from "express";
import { prisma } from '../../lib/prisma';

export const createNote = async (req: Request, res: Response) => {
  try{
    const body = (req.body ?? {}) as {
      content: string
    }
    const param = (req.params ?? {}) as {
      leadId: string
    }

    const { content } = body;
    const { leadId } = param;
    const authorId = req.user.id;

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
      leadId: string
    }
    const { leadId } = param;

    const notes = await prisma.lead.findUnique({
      where: { id: leadId }
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
      noteId: string
    }
    const { noteId } = param;

    const userRole = req.user.role;
    if(userRole !== "ADMIN"){
      res.status(403).json("Only Admins are allowed to delete a note");
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