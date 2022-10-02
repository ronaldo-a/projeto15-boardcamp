import express from 'express';
import { getCategories, insertCategory } from "../controllers/categoryController.js";
import { getCustomers, getCustomersById, insertCustomer, updateCustomer } from '../controllers/customerController.js';
import { getGames, insertGame } from '../controllers/gameController.js';
import { deleteRental, finishRental, getRentals, insertRental } from '../controllers/rentalController.js';
import { verifyCategoryName } from '../middlewares/categoryMiddleware.js';

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", verifyCategoryName, insertCategory);
router.get("/games", getGames);
router.post("/games", insertGame);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", insertCustomer);
router.put("/customers/:id", updateCustomer);
router.get("/rentals", getRentals);
router.post("/rentals", insertRental);
router.post("/rentals/:id/return", finishRental);
router.delete("/rentals/:id", deleteRental);

export {router};