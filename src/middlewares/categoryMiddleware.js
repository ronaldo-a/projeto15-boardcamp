import connection from "../db.js";
import Joi from "joi";

const categorySchema = Joi.object({
    name: Joi.string().empty(" ").required()
})

async function verifyCategoryName (req, res, next) {
    const {name} = req.body;

    const validateCategory = categorySchema.validate(req.body);
    
    if (validateCategory.error) {
        return res.status(400).send(validateCategory.error.details[0].message);
    };

    try {
        const categories = (await (connection.query("SELECT name FROM categories;"))).rows;
        console.log(categories);

        if (categories.length !== 0) {
            for (let i = 0; i < categories.length; i++) {
                if (categories[i].name.toLowerCase() === name.toLowerCase()) {
                    return res.sendStatus(409);
                }
            }
        }
    
    } catch (error) {
        console.log(error)
    }
    
    res.locals.name = name;
    next();
}

export {verifyCategoryName};