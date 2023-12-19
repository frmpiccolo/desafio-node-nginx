const http = require('http');
const mysql = require('mysql');
const port = 8080

const connection = mysql.createConnection({
    host: 'db', 
    user: 'root', 
    password: 'root', 
    database: 'nodedb'
});

connection.connect((err) => {
  if (err) throw err;

  console.log('Connected to MySQL Server!');

  const createTableQuery = `CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )`;

  connection.query(createTableQuery, (err, result) => {
    if (err) throw err;
    console.log('Table created or already exists.');
    
    const names = ['Fermin', 'Haline', 'Enzo', 'Vitoria', 'Doguinha']      

    Promise.all(names.map(insertNameIfNotExists)).then(() => {
      startHttpServer();
    });
  });
});

function insertNameIfNotExists(name) {
  return new Promise((resolve, reject) => {
    const checkIfExistsQuery = `SELECT * FROM people WHERE name = '${name}'`;

    connection.query(checkIfExistsQuery, (err, results) => {
      if (err) {
        reject(err);
        return;
      }
      if (results.length === 0) {
        const insertQuery = `INSERT INTO people (name) VALUES ('${name}')`;

        connection.query(insertQuery, (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          resolve();
        });
      } else {
        resolve();
      }
    });
  });
}

function startHttpServer() {
  http.createServer((req, res) => {
    const selectQuery = `SELECT * FROM people`;

    connection.query(selectQuery, (err, results) => {
      if (err) throw err;

      let html = `<html><head><title>Full Cycle Challenge - Node and Nginx</title></head><body><h1>Full Cycle Rocks!</h1><table border='1'><tr><th>ID</th><th>Name</th></tr>`;

      results.forEach(person => {
        html += `<tr><td>${person.id}</td><td>${person.name}</td></tr>`;
      });

      html += `</table></body></html>`;

      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    });
  }).listen(port, () => {
    console.log('Server is running.');
  });
}
