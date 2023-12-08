import express from 'express';
import cors from 'cors';
import fs from 'fs';
const app = express()

const PORT = 3566

app.use(cors())
app.use(express.json({limit: '50mb'}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    next();
});

app.post('/addValue', (req, res) => {
    if (!('uid' in req.body) || !('pseudo' in req.body) || !('score' in req.body) || !('time' in req.body)) {
        return res.status(401).json('error')
    }
    let bdd = JSON.parse(fs.readFileSync('bdd.json'));
    bdd.list.push({uid: req.body.uid, pseudo: req.body.pseudo, score: req.body.score, time: req.body.time, aw: req.body.aw})
    bdd.list.sort(function(a, b) { 
        return parseInt(b.score) - parseInt(a.score);
    })
    let pos = bdd.list.map(e => e.uid).indexOf(req.body.uid);
    fs.writeFileSync('bdd.json', JSON.stringify(bdd));
    res.json({pos: pos + 1, tot: bdd.list.length})
});

app.get('/getAll', (req, res) => {
    let bdd = JSON.parse(fs.readFileSync('bdd.json'));
    res.json(bdd.list)
});

app.post('/get', (req, res) => {
    let bdd = JSON.parse(fs.readFileSync('bdd.json'));
    let pos = bdd.list.map(e => e.uid).indexOf(req.body.uid);
    if (pos != -1) {
        res.json(bdd.list[pos])
    } else {
        res.status(401).json('error')
    }
});

app.get('*', (req, res) => {
    return res.status(404).json({ message: 'Page not found' })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`)
})