const express = require('express');

const Users = require('./user-model');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).send('<h1>Hello world</h1>');
})

router.get('/api/users', (req, res, next) => {
  Users.getUsers().then(users => {
    if (users) {
      res.status(200).json(users);
    } else {
      next({ message: "No users were found", status: 404 });
    }
  }).catch(next);
});

router.get('/api/users/:id', validateUserId, (req, res, next) => {
  res.status(200).json(req.user);
});

router.post('/api/users', validateUserBody, (req, res, next) => {
  Users.add(req.body).then(user => {
    res.status(201).json(user);
  }).catch(next);
});

router.put('/api/users/:id', validateUserId, validateUserBody, (req, res, next) => {
  Users.update(req.body, req.user.id).then(updatedScheme => {
    res.status(200).json(updatedScheme);
  }).catch(next);
});

router.delete('/api/users/:id', validateUserId, (req, res, next) => {
  Users.remove(req.user.id).then(deleted => {
    res.status(204).json(req.user);
  }).catch(next);
});

function validateUserId(req, res, next) {
  const { id } = req.params;
  let validId = Number(id);
  if (!Number.isInteger(validId) && validId > 0) {
    next({ message: 'Invalid user id' })
  }
  Users.getUser(validId).then(user => {
    if (user) {
      req.user = user;
      next();
    } else {
      next({ message: 'Could not find user with given id', status: 404 });
    }
  }).catch(next);
}

function validateUserBody(req, res, next) {
  const { username, password } = req.body;
  if (!username || !password) {
    next({ message: 'Missing required `username` and `password` fields', status: 401 });
  }
  req.body = { username, password };
  next();
}

router.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    file: 'user-router',
    method: req.method,
    url: req.url,
    status: error.status || 500,
    message: error.message
  });
})

module.exports = router;