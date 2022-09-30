import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connection from "./src/db.js";
import { router } from "./src/routes/routes.js";

const server =  express();
dotenv.config();

server.use(cors());
server.use(express.json());

server.use(router);

/* server.get("/", (req, res) => {
    const promise = connection.query('SELECT * FROM categories;');
    promise.then(result => res.send(result.rows[0]));
}); */

server.listen(process.env.PORT, () => console.log(`Listening at ${process.env.PORT}`));