//Import da biblioteca Express
const express = require("express");

//Iniciando o servidor com o express()
const server = express();


//Para dizer ao servidor que ira se comunicar em JSON
server.use(express.json());

//Para contar o numero de requisicoes ao servidor
let numberOfRequests = 0;

//Estrutura de dados para armazenar localmente os Projetos
const projects = [];

//Middleware para contar requisicoes e mostrar o log
function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);
  return next();
}

//Middleware para checar se o projeto existe
function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return res.status(400).json({ error: 'Project not found' });
  }

  return next();
}

//Middleware de uso global
server.use(logRequests);

//Rota para listar todos os projetos e suas tasks
server.get('/projects', (req, res) => {
  return res.json(projects);
});

//Rota para alterar o titulo de um determinado projeto
server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);

  project.title = title;

  return res.json(project);
});

//Rota para Deletar um projeto passando o ID
server.delete('/projects/:id', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Rota para Criar um novo projeto
server.post('/projects', (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Rota para criar uma task em um determinado projeto pelo ID
server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(title);

  return res.json(project);
});



//Servidor roda pela porta: http://localhost:3000
server.listen(3000);


