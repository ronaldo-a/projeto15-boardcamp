import express from 'express';
import { getCategories, insertCategory } from "../controllers/categoryController.js";
import { getCustomers, getCustomersById, insertCustomer, updateCustomer } from '../controllers/customerController.js';
import { getGames, insertGame } from '../controllers/gameController.js';
import { deleteRental, finishRental, getRentals, insertRental } from '../controllers/rentalController.js';
import { verifyCategoryName } from '../middlewares/categoryMiddleware.js';
import { verifyCustomer } from '../middlewares/customerMiddleware.js';
import { validateGame } from '../middlewares/gameMiddleware.js';
import { isRentalActive, isRentalFinished, verifyRental } from '../middlewares/rentalMiddleware.js';

const router = express.Router();

router.get("/categories", getCategories);
router.post("/categories", verifyCategoryName, insertCategory);
router.get("/games", getGames);
router.post("/games", validateGame, insertGame);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomersById);
router.post("/customers", verifyCustomer, insertCustomer);
router.put("/customers/:id", verifyCustomer, updateCustomer);
router.get("/rentals", getRentals);
router.post("/rentals", verifyRental, insertRental);
router.post("/rentals/:id/return", isRentalActive, finishRental);
router.delete("/rentals/:id", isRentalFinished, deleteRental);

export {router};