import connection from "../db.js";
import dayjs from "dayjs";

async function getRentals (req, res) {
    const {customerId, gameId} = req.query;
    let rentals = [];

    try {
        if (customerId !== undefined) {
            rentals = (await connection.query(`SELECT * FROM rentals WHERE "customerId"=$1;`, [customerId])).rows
        } else if (gameId !== undefined) {
            rentals = (await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1;`, [gameId])).rows
        } else {
            rentals = (await connection.query(`SELECT * FROM rentals;`)).rows;
        }
        
        for (let i = 0; i < rentals.length; i++) {
            const gameid = rentals[i].gameId;
            const customerid = rentals[i].customerId;
            rentals[i].rentDate = dayjs(rentals[i].rentDate).format("YYYY-MM-DD");
            if (rentals[i].returnDate !== null) {
                rentals[i].returnDate = dayjs(rentals[i].returnDate).format("YYYY-MM-DD");
            }

            const customer = (await connection.query(`SELECT customers.id, customers.name FROM customers WHERE id = ${customerid}`)).rows[0];
            const game = (await connection.query(`SELECT games.id, games.name, games."categoryId", categories.name as "categoryName" FROM games 
                                                    JOIN categories 
                                                    ON  games."categoryId" = categories.id WHERE games.id = ${gameid}`)).rows[0];
            rentals[i] = {...rentals[i], customer, game};
        } 
        
        return res.status(200).send(rentals);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function insertRental (req, res) {
    const {customerId, gameId, daysRented} = res.locals.rental;

    try {
        const game = (await connection.query(`SELECT * FROM games WHERE id=${gameId};`)).rows[0];
        const rentDate = dayjs().format("YYYY-MM-DD");
        const originalPrice = game.pricePerDay * daysRented;
        const returnDate = null;
        const delayFee = null;

        await connection.query(`INSERT INTO rentals 
                            ("customerId", "gameId", "daysRented", "rentDate", "originalPrice", "returnDate", "delayFee") VALUES
                            (${customerId}, ${gameId}, ${daysRented}, '${rentDate}', ${originalPrice}, ${returnDate}, ${delayFee});`)
        
        return res.sendStatus(201);

    } catch (error) {
        res.sendStatus(500);
    }
    
}

async function finishRental (req, res) {
    const {id} = res.locals.rentalId;
    const returnDate = dayjs().format("DD/MM/YYYY");
    let delayFee = 0;

    try {
        const rentalData = (await connection.query(`SELECT rentals."rentDate", rentals."daysRented", games."pricePerDay" FROM rentals JOIN games ON rentals."gameId" = games.id WHERE rentals.id=${id};`)).rows[0];
        const limitReturnDay = dayjs(rentalData.rentDate).add(rentalData.daysRented, "day");
        
        if ((dayjs(returnDate).diff(limitReturnDay, "day")) > 0) {
            delayFee = (dayjs(returnDate).diff(limitReturnDay, "day")) * rentalData.pricePerDay;
        }

        await connection.query(`UPDATE rentals SET "returnDate"='${returnDate}', "delayFee"=${delayFee} WHERE id=$1;`, [id]);
        
        return res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function deleteRental (req, res) {
    const {id} = res.locals.rentalId;

    try {
        await connection.query(`DELETE FROM rentals WHERE id=${id};`)
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

export {getRentals, insertRental, finishRental, deleteRental};