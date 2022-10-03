import connection from "../db.js";
import dayjs from "dayjs";

async function getCustomers (req, res) {
    const subCpf = req.query.cpf;

    try {
        let customers = (await connection.query("SELECT * FROM customers;")).rows;
        if (subCpf) {
            let filteredCustomers = customers.filter(customer => customer.cpf.startsWith(subCpf));
            filteredCustomers.forEach(customer => customer.birthday = dayjs(customers.birthday).format("YYYY-MM-DD"));
            return res.status(200).send(filteredCustomers);
        }

        customers.forEach(customer => customer.birthday = dayjs(customer.birthday).format("YYYY-MM-DD"));
        return res.status(200).send(customers);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function getCustomersById (req, res) {
    const id = req.params.id;

    try {
        const customer = (await connection.query(`SELECT * FROM customers WHERE id = $1`, [id])).rows[0];
       
        if (!customer) {
            return res.sendStatus(404);
        }

        customer.birthday = dayjs(customer.birthday).format("YYYY-MM-DD");
        return res.status(200).send(customer);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function insertCustomer (req, res) {
    const {name, phone, cpf, birthday} = res.locals.customer; 

    try {
        await connection.query(`INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1, '${phone}', '${cpf}', '${birthday}')`, [name]);
        res.sendStatus(201);
    } catch (error) {
        res.sendStatus(500);
    }
}

async function updateCustomer (req, res) {
    
    const {name, phone, cpf, birthday, id} = res.locals.customer;

    try {
        await connection.query (`UPDATE customers SET name=$1, phone='${phone}', cpf='${cpf}', birthday='${birthday}' WHERE id = $2;`, [name, id]);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
}

export {getCustomers, getCustomersById, insertCustomer, updateCustomer};