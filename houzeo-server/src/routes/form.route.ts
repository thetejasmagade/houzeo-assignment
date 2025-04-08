import { Router } from 'express';
import { authForm } from '../controllers/auth.controller';
import { submitForm, getSubmissions } from '../controllers/form.controller';

const router = Router();

router.post('/auth', authForm);
router.post('/submit', submitForm);
router.get('/submissions', getSubmissions);

export default router;
