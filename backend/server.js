// importer modules nécessaires
const express = require('express');
const fs = require('fs');
const path = require('path');

// définir chemin vers user.json
const dataPath = path.join(__dirname, 'user.json');

// lire les données du fichier JSON au démarrage
let rawData = fs.readFileSync(dataPath);
let data = JSON.parse(rawData);

// récupérer la liste des personnages depuis les données JSON
let characters = data.characters;

// créer l'application Express
const app = express();

// port d'écoute
const PORT = 3000;

// middleware pour lire le JSON dans le body des requêtes
app.use(express.json());

// GET /characters - retourner la liste des personnages
app.get('/characters', (req, res) => {
  res.json(characters);
});

// POST /characters - ajouter un nouveau personnage
app.post('/characters', (req, res) => {
  const { name, realName, universe } = req.body;  // noter : universe au lieu de univers (voir JSON)

  // générer un nouvel id (timestamp)
  const newCharacter = {
    id: Date.now(),
    name,
    realName,
    universe
  };

  // ajouter à la liste
  characters.push(newCharacter);

  // répondre avec le personnage créé
  res.status(201).json(newCharacter);

  // optionnel : sauvegarder dans le fichier JSON (voir note ci-dessous)
});

// PUT /characters/:id - modifier un personnage existant
app.put('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, realName, universe } = req.body;

  // chercher index
  const index = characters.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ message: "Character not found" });
  }

  // modifier personnage
  characters[index] = { id, name, realName, universe };

  res.json(characters[index]);

  // optionnel : sauvegarder dans le fichier JSON
});

// DELETE /characters/:id - supprimer un personnage
app.delete('/characters/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const newCharacters = characters.filter(c => c.id !== id);

  if (newCharacters.length === characters.length) {
    return res.status(404).json({ message: "Character not found" });
  }

  characters = newCharacters;

  res.json({ message: "Character deleted" });

  // optionnel : sauvegarder dans le fichier JSON
});

// démarrer le serveur
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
