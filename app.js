const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors'); // Adicione esta linha

const PORT = process.env.PORT || 3000;


const app = express();
app.use(bodyParser.json());
app.use(cors()); // Adicione esta linha para habilitar o CORS


// Conectar ao banco de dados SQLite (cria o banco se não existir)
const db = new sqlite3.Database('./mydatabase.db');

// Criação da tabela "pedidos" se não existir
db.run(`CREATE TABLE IF NOT EXISTS cursos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT,
    carga TEXT,
    grade TEXT,
    professor TEXT
)`);

app.get('/', (req, res) => {
  return res.json("Olá, Mundo!!")
});


// Endpoint para listar todos os pedidos
app.get('/cursos', (req, res) => {
    db.all('SELECT * FROM cursos', (err, rows) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erro ao buscar pedidos' });
        } else {
            res.json(rows);
        }
    });
});

// Endpoint para criar um novo pedido
app.post('/cursos/add', (req, res) => {
    const { nome, carga, grade, professor } = req.body;
    db.run(
        'INSERT INTO cursos ( nome,  carga, grade, professor) VALUES (?, ?, ?, ?)',
        [nome, carga, grade, professor],
        function (err) {
            if (err) {
                console.error(err);
                res.status(500).json({ error: 'Erro ao criar pedido' });
            } else {
                res.json({ id: this.lastID, nome, carga, grade, professor});
            }
        }
    );
});

// Rota para atualizar um dado existente
app.put('/cursos/update/:id', (req, res) => {
    const id = req.params.id;
    const { nome, carga, grade, professor } = req.body;
  
    db.run('UPDATE cursos SET nome=?, carga=?, grade=?, professor=? WHERE id=?', [nome, carga, grade, professor, id], function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ mensagem: 'Dado atualizado com sucesso.' });
    });
  });

  // Rota para excluir um dado
  app.delete('/cursos/del/:id', (req, res) => {
    const id = req.params.id;

    db.run('DELETE FROM cursos WHERE id=?', id, function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      res.json({ mensagem: 'Dado excluído com sucesso.' });
    });
  });

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
