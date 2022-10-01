import connection from "../db.js";

async function getCustomers (req, res) {
    const subCpf = req.query.cpf;

    try {
        const customers = await connection.query("SELECT * FROM customers;");
        if (subCpf) {
            const filteredCustomers = customers.rows.filter(customer => customer.cpf.startsWith(subCpf));
            return res.status(200).send(filteredCustomers);
        }

        return res.status(200).send(customers.rows);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getCustomersById (req, res) {
    const id = req.params.id;

    try {
        const customer = await connection.query(`SELECT * FROM customers WHERE id = ${id}`);
        if (customer.rows.length === 0) {
            return res.sendStatus(404);
        }

        return res.status(200).send(customer.rows[0]);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function insertCustomer (req, res) {
    const {name, phone, cpf, birthday} = req.body; 

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ('${name}', '${phone}', '${cpf}', '${birthday}')`);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function updateCustomer (req, res) {
    const id = req.params.id;
    const {name, phone, cpf, birthday} = req.body;

    try {
        await connection.query (`UPDATE customers SET name='${name}', phone='${phone}', cpf='${cpf}', birthday='${birthday}' WHERE id = ${id};`);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

export {getCustomers, getCustomersById, insertCustomer, updateCustomer};