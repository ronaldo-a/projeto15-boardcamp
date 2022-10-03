import Joi from "joi";
import connection from "../db.js";

const rentalSchema = Joi.object({
    customerId: Joi.number().integer().min(1).required(),
    gameId: Joi.number().integer().min(1).required(),
    daysRented: Joi.number().integer().min(1).required()
});

async function verifyRental (req, res, next) {
    
    const {gameId, customerId} = req.body;
    const validation = rentalSchema.validate(req.body, {abortEarly: false});

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    }

    const dataExists = await connection.query(`SELECT EXISTS (SELECT 1 FROM games, customers WHERE games.id=${gameId} AND customers.id=${customerId})`);
    if (dataExists.rows[0].exists === false) {
        return res.status(400).send("Game and/or customer not found.");
    }

    const rentedGameQtd = (await connection.query(`SELECT * FROM rentals WHERE "gameId"=${gameId};`)).rows;
    const gameStock = (await connection.query(`SELECT "stockTotal" FROM games WHERE id=${gameId};`)).rows[0];
    if (rentedGameQtd.length === gameStock.stockTotal) {
        return res.status(400).send("All copies of this game already rented.");
    }

    res.locals.rental = req.body;
    next();
}

async function isRentalActive (req, res, next) {
    const {id} = req.params;

    const rentalData = await connection.query(`SELECT rentals."returnDate" FROM rentals WHERE id=$1;`, [id]);
    if (rentalData.rows.length === 0) {
        return res.status(404).send("Rental not found.");
    } else if (rentalData.rows[0].returnDate !== null) {
        return res.status(400).send("Rental already finished.");
    } 

    res.locals.rentalId = req.params;
    next();
}

async function isRentalFinished (req, res, next) {
    const {id} = req.params;

    const rentalData = await connection.query(`SELECT rentals."returnDate" FROM rentals WHERE id=$1;`, [id]);
    if (rentalData.rows.length === 0) {
        return res.status(404).send("Rental not found.");
    } else if (rentalData.rows[0].returnDate === null) {
        return res.status(400).send("Rental not finished yet.");
    } 

    res.locals.rentalId = req.params;
    next();
}

export {verifyRental, isRentalActive, isRentalFinished};