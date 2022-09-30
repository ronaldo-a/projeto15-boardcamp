import express from 'express';
import { getCategories, insertCategory } from "../controllers/categoryController.js";
import { getGames, insertGame } from '../controllers/gameController.js';
import { verifyCategoryName } from '../middlewares/categoryMiddleware.js';

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", verifyCategoryName, insertCategory);
router.get("/games", getGames);
router.post("/games", insertGame);

export {router};