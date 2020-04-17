const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const likes = [];

function validateRepositoryId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();
}

app.use('/repositories/:id', validateRepositoryId);

app.get("/repositories", (req, res) => {
  const resultRepositories = repositories.map(r => {
    const amountLikes = likes.map(l => l.repository_id === r.id)
    return {
      id: r.id,
      title: r.title,
      url: r.url,
      techs: r.techs,
      likes: amountLikes.length
    }
  })
  return res.json(resultRepositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs
  };

  repositories.push(repository);

  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const { title, url, techs } = req.body;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.'} );
  }

  const repository = {
    id,
    title,
    url,
    techs
  };

  repositories[repIndex] = repository;

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repIndex = repositories.findIndex(r => r.id === id);

  if (repIndex < 0) {
    return res.status(400).json({ error: 'Project not found.'} );
  }

  repositories.splice(repIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;

  likes.push({repository_id: id});

  const resultLikes = likes.map(l => l.repository_id === id);

  if (!resultLikes.length) {
    return res.status(400).json({ error: 'Repository not found.'} );
  }

  return res.json({ message: `Amount of liked the repository is: ${resultLikes.length}`});
});

module.exports = app;