const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();
//const {uuid, isUuid} = require('uuidv4');

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  // Rota que lista todos os reposítórios
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // rota recebe title, url e techs
    const {title, url, techs} = request.body;
    const challenge = {id:uuid(), title, url, techs, likes: 0 };
    repositories.push(challenge);

    return response.json(challenge);
});

app.put("/repositories/:id", (request, response) => {
  // altera apenas o title, a url e as techs do repositório
  const {id} = request.params;
  const {title, url, techs} = request.body;
  const challengeIndex = repositories.findIndex(challenge => challenge.id === id);

  if (challengeIndex === -1) {
    return response.status(400).json({ error: 'Project not found.'})
  }
  

  const challenge = {
    id,
    title,
    url,
    techs,
    likes: repositories[challengeIndex].likes,

  };
  repositories[challengeIndex] = challenge;

  return response.json(challenge);

});

app.delete("/repositories/:id", (request, response) => {
  // deletar o repositório com o id
  const {id} = request.params;
  const challengeIndex = repositories.findIndex(challenge => challenge.id === id);

  if (challengeIndex > 0) {
     repositories.splice(challengeIndex, 1);
  } else {
    return response.status(400).json({ error: 'Project not found.'})
  }
  
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // aumentar o número de likes do repositório específico escolhido através do id
   const {id,} = request.params;

   const challengeIndex = repositories.findIndex(challenge => challenge.id === id);

   if (challengeIndex === -1) {
    return response.status(400).json({ error: 'Project not found.'})
    }

  repositories[challengeIndex].likes +=1;

  return response.json(repositories[challengeIndex]);

});

module.exports = app;
