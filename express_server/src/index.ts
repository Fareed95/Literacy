import { Request, Response } from 'express';
import pool from './db';  
import cors from "cors"
import  express from 'express';
import { router } from './inboxRoutes';
import { createInboxTable } from './createInboxTable';

const app = express(); 
app.use(express.json());

const allowedOrigins: string[] = [
    "http://localhost:3000",
    "https://templetrepo.vercel.app/",
];



const corsOption= {
    origin: allowedOrigins,
    methods: 'GET, POST, PUT, DELETE',
    allowedHeaders: "https://test-repo-jzwm.onrender.com/"
  
}

app.use(cors(corsOption))

app.get('/api/userslist', async (req: Request, res: Response) => {
  try {
   
    const result = await pool.query('SELECT id, name, email FROM api_user');
    
    console.log('Data has been received');
    res.json(result.rows);  


  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.use(router);

createInboxTable();
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});



