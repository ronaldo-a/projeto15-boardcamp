import connection from "../db.js";

async function verifyCategoryName (req, res, next) {
    const {name} = req.body;
    console.log(name);

    if (!name) {
        return res.sendStatus(400);
    }

    try {
        const categories = await (connection.query("SELECT name FROM categories")).rows;

        if (categories) {
            for (i =0; i < categories.length; i++) {
                if (categories[i].name === name) {
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