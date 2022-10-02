import connection from "../db.js";

function getCategories (req, res) {
    
    connection.query('SELECT * FROM categories;')
    .then(categorie => res.send(categorie.rows))
    .catch(err => res.send(err))
}

function insertCategory (req, res) {

    const name = res.locals.name;

    const promise = connection.query(`INSERT INTO categories (name) VALUES ($1)`, [name])
    promise.then(result => {return res.status(201).send("Categoria inserida com sucesso.")})
    promise.catch(err => res.status(500).send(err));
}

export {getCategories, insertCategory};