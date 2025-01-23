import { Router } from 'express';
import { messageRequest, inboxMessages } from './inboxController';

const router = Router();


router.post('/api/message_request', messageRequest);


router.post('/api/inbox_request', inboxMessages);

export { router };