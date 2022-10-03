import connection from "../db.js";

async function getGames (req, res) {

    const subName = req.query.name;

    try {
        const games = await connection.query(`SELECT games.*, categories.name AS "categoryName" FROM games JOIN categories ON games."categoryId" = categories.id`);
        console.log(games);
        if (subName) {
            const filteredGames = games.rows.filter(game => game.name.toLowerCase().startsWith(subName.toLowerCase()));
            console.log(filteredGames);
            return res.status(200).send(filteredGames);
        }
            
        return res.status(200).send(games.rows);
            
    } catch (error) {
        res.status(500).send(error);
    }

}    

async function insertGame (req, res) {
    const {name, image, stockTotal, categoryId, pricePerDay} = res.locals.game;    
    console.log(res.locals.game);

    try {
        await connection.query(`INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay") VALUES ('${name}', '${image}', ${stockTotal}, ${categoryId}, ${pricePerDay})`);
        return res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

export {getGames, insertGame};