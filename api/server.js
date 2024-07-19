// BUILD YOUR SERVER HERE
const express = require('express')
const User = require('./users/model')
const server = express()

server.use(express.json())

server.get('/api/users', (req, res) => {
    User.find()
    .then(users => {
        res.json(users)
    })
    .catch(err => {
        res.status(500).json({
             message: "The users information could not be retrieved" 
        })
    })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if(!user){
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.json(user)}
    })
    .catch(err => {
        res.status(500).json({ message: "The user information could not be retrieved" })
    })
})

server.post('/api/users', (req, res) => {
    const user = req.body;
    console.log(req)
        if(!user.name || !user.bio){
            res.status(400).json({ message: "Please provide name and bio for the user" })
        }else{
            User.insert(user)
            .then(newUser => {
                res.status(201).json(newUser)
            })
            .catch(err => {
                res.status(500).json({ message: "There was an error while saving the user to the database" })
            })
        }
})

server.delete('/api/users/:id', (req, res) => {
    User.remove(req.params.id)
    .then(user => {
        if(!user) {
            res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else{
            res.json(user)
        }
    })
    .catch(err => {
        res.status(500).json({ message: "The user could not be removed" })
    })
})

server.put('/api/users/:id', async (req, res) => {
    try{
        const currentUser = await User.findById(req.params.id)
        if(!currentUser){
             res.status(404).json({ message: "The user with the specified ID does not exist" })
        }else if(!req.body.bio || !req.body.name){
            res.status(400).json({ message: "Please provide name and bio for the user" })
        }else{
            const newUser = await User.update(req.params.id, req.body)
            res.status(200).json(newUser)
        }
    }
    catch(err){
        res.status(500).json({ message: "The user information could not be modified" })
    }
})



server.use('*', (req, res) => {
    res.status(404).json({
        message: 'message not found'
    })
})

module.exports = server; 
