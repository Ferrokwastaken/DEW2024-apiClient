const express = require('express');
const app = express();
const PORT = 3000;
const CLIENTS = require('./data/clients.json');
let idMax = Math.max(...CLIENTS.map(c => c.id))

app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hola mundo!!');
});

app.get('/api', (req, res) => {
  res.send('api de clientes');
});

app.get('/api/client', (req, res) => {
  res.json(CLIENTS.map(c => {
    return {
      id: c.id,
      nombre: c.nombre,
      apellidos: c.apellidos,
      email: c.cuenta.email
    }
  }));
});

app.get('/api/client/:id', (req, res) => {
  const id = req.params.id;
  let filterClient = CLIENTS.filter(c => c.id == id);
  if (filterClient.length) {
    res.json(filterClient[0]);
  } else {
    res.send(404).send('El cliente con id = ' + id + ' no encontrado');
  }
});

app.post('/api/client', (req, res) => {
  const newClient = req.body
  let error = []
  // if (newClient.nombre && newClient.apellidos && newClient.cuenta.email) {
  if (!newClient.nombre) error.push("Falta el nombre, ")
  if (!newClient.apellidos) error.push("Falta los apellidos, ")
  if (!newClient.cuenta.email) error.push("Falta el email")
  if (error.length == 0) {
    newClient.id = ++idMax
    CLIENTS.push(newClient)
    res.status(201).json(newClient)
  } else {
    res.status(422).send('Faltan los campos: ' + error.join(', '))
  }
})

app.delete('/api/client/:id', (req, res) => {
  const id = req.params.id
  const index = CLIENTS.findIndex(client => client.id == id)
  if (index >= 0) {
    CLIENTS.splice(index, 1)
    res.status(200).send('Borrado')
  } else {
    res.status(404).send('No encontrado')
  }
})

app.put('/api/client/:id', (req, res) => {
  const id = req.params.id
  let filterClient = CLIENTS.filter(c => c.id == id);
  if (filterClient.length) {
    const client = filterClient[0]
    const newClient = req.body
    client.nombre = newClient.nombre
    client.apellidos = newClient.apellidos
    client.cuenta.email = newClient.cuenta.email
    res.send('Modificado')
  } else {
    res.send(404).send('El cliente con id = ' + id + ' no encontrado');
  }
})

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log('El servidor está escuchando en el puerto ' + PORT);
});