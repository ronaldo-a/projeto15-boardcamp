import Joi from "joi";
import connection from "../db.js";

const gameSchema = Joi.object({
        name: Joi.string().empty(" ").required(),
        image: Joi.string().uri(),
        stockTotal: Joi.number().integer().min(1).required(),
        categoryId: Joi.number().integer().required(),
        pricePerDay: Joi.number().integer().min(1).required()
});

async function validateGame (req, res, next) {
    const {name, categoryId} = req.body;

    const gameValidation = gameSchema.validate(req.body, {abortEarly: false});

    if (gameValidation.error) {
        const errors = gameValidation.error.details.map(detail => detail.message);
        return res.status(400).send(errors);
    }

    const isCategory = (await connection.query(`SELECT * FROM categories WHERE id=${categoryId}`)).rows;
    if (isCategory.length === 0) {
        return res.status(400).send("Category Id not found");
    }

    const isName = (await connection.query(`SELECT * FROM games WHERE LOWER(name)='${name.toLowerCase()}';`)).rows;
    if (isName.length !== 0) {
        return res.sendStatus(409)
    }

    res.locals.game = req.body;
    next();
} 

export {validateGame}