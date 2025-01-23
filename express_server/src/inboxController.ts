import { Request , Response } from "express";
import pool from "./db";



export const messageRequest = async(req: Request , res: Response): Promise<void> => {
    const  {to_email , from_email} = req.body;
  
    try {
      await pool.query(
        'INSERT INTO inbox (requested_email, user_email) VALUES ($1, $2)',
        [from_email, to_email]
      )
      res.status(200).send({ message: 'Request sent successfully.' });
    } catch (error) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  }
  
  export const inboxMessages = async (req: Request, res: Response): Promise<void> => {
    const { userEmail } = req.body;
  
    try {
      const result = await pool.query(
        'SELECT requested_email, user_email FROM inbox WHERE user_email = $1',
        [userEmail]
      );
  
      res.status(200).send(result.rows);
  
    } catch (error) {
      res.status(500).send({ message: 'Internal server error.' });
    }
  };