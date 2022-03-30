import Infobae from "./sources/infobae";
import Twitter from "./sources/twitter";
import dotenv from "dotenv";

dotenv.config();

import express from 'express';
import cors from 'cors';

import bodyParser from "body-parser";
import * as url from "url";

const app = express();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Timezones by location application is running on port ${port}.`);
});

app.use(cors())
app.use(bodyParser.json())

const sources = {
    infobae: new Infobae(),
    twitter: new Twitter()
}

app.get('/sources/:source/contents', (req, res) => {
    const source = req.params.source
    sources[source]
        .getContents()
        .then(urls => res.send(urls))
})

app.get('/sources/:source/contents/:URL', (req, res) => {
    const source = req.params.source
    const URL = req.params.URL
    sources[source]
        .getContent(URL)
        .then(urls => res.send(urls))
})




