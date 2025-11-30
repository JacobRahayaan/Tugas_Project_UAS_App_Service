import express from 'express';
import { searchPosts, getSearchSuggestions } from '../controllers/search.controller.js';

const router = express.Router();

router.get('/posts', searchPosts);
router.get('/suggestions', getSearchSuggestions);

export default router;