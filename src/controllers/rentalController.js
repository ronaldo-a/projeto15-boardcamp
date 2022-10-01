import connection from "../db.js";
import dayjs from "dayjs";

async function getRentals (req, res) {
    try {
        const rentals = (await connection.query(`SELECT * FROM rentals;`)).rows

        for (let i = 0; i < rentals.length; i++) {
            const gameid = rentals[i].gameId;
            const customerid = rentals[i].customerId;

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

    try {
        const {customerId, gameId, daysRented} = req.body;
        const game = (await connection.query(`SELECT * FROM games WHERE id=${gameId};`)).rows[0];
        
        const rentDate = dayjs().format("DD/MM/YYYY");
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
    const {id} = req.params;
    const realReturnDate = dayjs().format("DD/MM/YYYY");

    try {
        const returnDate = (await connection.query(`SELECT rental."returnDate" FROM rentals WHERE id=${id}`)).rows[0];
        const delayFee = (realReturnDate - returnDate); 
        await connection.query(`UPDATE rentals SET "returnDate"=${returnDate}, "delayFee"=${delayFee} WHERE id=${id};`)
        return res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

export {getRentals, insertRental, finishRental};