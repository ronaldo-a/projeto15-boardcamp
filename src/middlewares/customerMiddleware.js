import Joi from "joi";
import connection from "../db.js";

const customerSchema = Joi.object({
    name: Joi.string().empty(" ").required(), 
    phone: Joi.string().max(11).min(10).pattern(/^[0-9]+$/).required(), 
    cpf: Joi.string().length(11).pattern(/^[0-9]+$/).required(), 
    birthday: Joi.date().required()
})

async function verifyCustomer (req, res, next) {
    const {cpf} = req.body;

    const validation = customerSchema.validate(req.body, {abortEarly: false});

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors)
    }

    const isCpf = (await connection.query(`SELECT * FROM customers WHERE cpf='${cpf}';`)).rows[0];
    if (isCpf) {
        return res.sendStatus(409);
    }

    res.locals.customer = req.body;
    next();
}

async function verifyUpdateCustomer (req, res, next) {
    const {cpf} = req.body;
    const {id} = req.params;

    const validation = customerSchema.validate(req.body, {abortEarly: false});

    if (validation.error) {
        const errors = validation.error.details.map(detail => detail.message);
        return res.status(400).send(errors)
    }

    const isId = (await connection.query(`SELECT * FROM customers WHERE id=$1`, [id])).rows[0];
    if (!isId) {
        return res.sendStatus(404);
    }

    const isCpf = (await connection.query(`SELECT * FROM customers WHERE id<>$1 AND cpf='${cpf}';`, [id])).rows[0];
    if (isCpf) {
        return res.sendStatus(409);
    }

    res.locals.customer = {...req.body, id};
    next();
}

export {verifyCustomer, verifyUpdateCustomer};