import express from 'express';
import cors from 'cors';
import { allFakers } from "@faker-js/faker";
import {genFailProd} from "./utils/errorUtils.js";
import { genMockData } from './mockGenerator/generator.js'

const app = express();

app.use(cors({
    origin: 'https://itransition-task5-front.vercel.app'
}));
app.use(express.json());

const port = process.env.PORT || 3301

app.listen(port, () => {
    console.log(`Running on port ${port}`);
});

app.post('/generate', (req, res) => {
    try {

        const STANDART_PAGE = 20

        const faker = allFakers[req.body.locale.str];
        faker.seed(req.body.iseed, 10);

        const totalErrors = req.body.failCount;
        const errorRate = 0;
        const failProducts = genFailProd(
            genMockData(faker, req.body.locale, STANDART_PAGE),
            totalErrors,
            errorRate
        );

        res.status(200).json(failProducts);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/getMore', (req, res) => {
    try {
        const ADD_PAGE = 10
        const STANDART_PAGE = 20


        const faker = allFakers[req.body.locale.str];
        faker.seed(req.body.iseed, 10);
        const page = req.body.page;

        const products = genMockData(faker, req.body.locale, page * ADD_PAGE + STANDART_PAGE);
        const result = products.slice(products.length - ADD_PAGE, products.length);

        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});
