import express from "express";
import bodyParser from "body-parser"; 
import pg from "pg";        // to connect to postgresSQL 

const app = express();
const port = 3001;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "#Sunset123",
  port: 5432,
});

db.connect((err) => { 
  if(err){ 
    console.log(err.stack)
  } 
  console.log("Database is successfully connected")

});

let quiz = [

];

// this loads up the the data from postreSQL server to the API. 
// gives us all the rows in the capital table 
db.query("SELECT * FROM capitals", (err, res) => {
  if (err) {
    console.error("Error executing query", err.stack);
  } else {
    quiz = res.rows;        // quizz is replace with data from our db
  }
  db.end();       // close of the connection once everything is done
});

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));       // this is for the post request
app.use(express.static("public"));

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  res.render("index.ejs", { question: currentQuestion });
});

// POST a new post
app.post("/submit", (req, res) => {
  let answer = req.body.answer.trim();
  let isCorrect = false;
  if (currentQuestion.capital.toLowerCase() === answer.toLowerCase()) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  nextQuestion();
  res.render("index.ejs", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

async function nextQuestion() {
  const randomCountry = quiz[Math.floor(Math.random() * quiz.length)];

  currentQuestion = randomCountry;
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
