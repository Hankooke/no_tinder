const express = require('express');

const app = express();

app.use('/s', express.static('styles'));
app.use(express.urlencoded());

var { Liquid } = require('liquidjs');
var engine = new Liquid();

// register liquid engine
app.engine('liquid', engine.express());
app.set('views', './views');            // specify the views directory
app.set('view engine', 'liquid');       // set liquid to default

const fs = require('fs');

const filename = './files/questions.txt'; // укажите здесь имя файла, из которого нужно читать

let questions = [];
fs.readFile(filename, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }

    const lines = data.split('\n');
    questions = lines.map(line => {
        let parts = line.split(" / ");
        return {
            question: parts[0],
            answer: "",
            answer_true: parts[1]
        };
    });

    console.log(questions);
});

app.get('/', (req, res) => {
    res.render('form', {
        questions: questions.map(item => item.question)
    });
})

app.post('/', (req, res) => {
    let answers = req.body.answer;

    questions.forEach((item, index) => {
        item.answer = answers[index];
    });
    console.log(questions);

    const AoutStream = fs.createWriteStream('./files/test_results.txt');
    AoutStream.write(JSON.stringify(answers));
    res.redirect(`result?v=${req.body.name}`);
});

app.get('/result', (req, res) => {
    res.render('result', {
        name: req.query.v,
        questions: questions
    });
})

app.listen(1900);