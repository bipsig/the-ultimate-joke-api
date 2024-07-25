import express from "express";
import { jokesData } from "./data.js";
import morgan from "morgan";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const masterKey = "4VGP2DN-6EWM4SJ-N6FGRHV-Z3PR3TT";

var jokes = jokesData;
var currId = 1296;

app.use (morgan ('dev'));
app.use (bodyParser.urlencoded ({ extended: true }));

app.get ('/random', (req, res) => {
    const ind = Math.floor (Math.random () * jokes.length);

    if (jokes.length === 0) {
        res.status (404);
        res.json ({ error: "No Jokes Found" });
    }
    else {
        res.json (jokes [ind]);
    }
})

app.get ('/jokes/:id', (req, res) => {
    const ind = parseInt(req.params.id);
    // console.log (ind);

    const joke = jokes.find (joke => joke.id === ind);
    // console.log (joke);

    if (joke) {
        res.json (joke);
    }
    else {
        res.status (404);
        res.json ({ error: "Joke Not Found"});
    }
})

app.get ('/filter', (req, res) => {
    const jokeType = req.query.type;
    // console.log (jokeType);

    const responseJokes = jokes.filter ((joke) => (joke.jokeType).toLowerCase() === jokeType.toLowerCase());

    if (responseJokes.length !== 0) {
        res.json (responseJokes);
    }
    else {
        res.status (404);
        res.json ({ error: "No such Jokes found of required type" })
    }
})

app.post ('/jokes', (req, res) => {
    // console.log (req.body);
    const jokeText = req.body.jokeText;
    const jokeType = req.body.jokeType;

    const joke = {
        id: currId,
        jokeText: jokeText,
        jokeType: jokeType
    };

    // console.log (joke);

    jokes.push (joke);
    currId++;

    res.json (joke);
})

app.put ('/jokes/:id', (req, res) => {
    const jokeId = parseInt (req.params.id)
    const newJoke = {
        id: jokeId,
        jokeText: req.body.jokeText,
        jokeType: req.body.jokeType
    }

    // console.log (newJoke);
    const ind = jokes.findIndex (joke => joke.id === jokeId);

    if (ind === -1) {
        res.status (404);
        res.json ({ error: "Joke with given joke ID is not found" });
    }
    else {
        jokes [ind] = newJoke;
        res.json (newJoke);
    }
})

app.patch ('/jokes/:id', (req, res) => {
    const jokeId = parseInt(req.params.id);

    const ind = jokes.findIndex (joke => joke.id === jokeId);

    if (ind === -1) {
        res.status (404);
        res.json ({ error: "Joke with given joke ID is not found" });
    }
    else {
        jokes [ind].id = jokeId;
        if (req.body.jokeText) {
            jokes [ind].jokeText = req.body.jokeText;
        }
        if (req.body.jokeType) {
            jokes [ind].jokeType = req.body.jokeType;
        }

        res.json (jokes [ind]);
    }
})


app.delete ('/jokes/:id', (req, res) => {
    const jokeId = parseInt(req.params.id);
    
    const joke = jokes.find (joke => joke.id === jokeId);
    
    if (joke) {
        jokes = jokes.filter (joke => joke.id !== jokeId);
        res.json (joke);
    }
    else {
        res.status (404);
        res.json ({ error: "Joke with given joke ID is not found" });
    }
})

app.delete ('/all', (req, res) => {
    const userKey = req.query.key;

    // console.log (userKey);

    if (userKey === masterKey) {
        jokes = [];
        res.sendStatus (200);
    }
    else {
        res.status (401);
        res.json ({ error: "User is not authorized" })
    }
})

app.listen (port, () => {
    console.log (`Server running successfully on port ${port}`);
})