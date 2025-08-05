const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')


let persons =
[
    { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    },
        { 
      "id": 5,
      "name": "Maria Hernandez", 
      "number": "39-23-6423245"
    }
]
app.use(express.json())
app.use(cors())


morgan.token('body', (request, response)=> JSON.stringify(request.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response)=>{
    const now = new Date()
    const dateFormatted = now.toUTCString()

    const info ={
        message:`Phonebook has info for ${persons.length} people  `,
        date: dateFormatted
    }
    response.send(`<h2>${info.message}</h2> <br/> <p>${info.date}</p> `)
}) 


app.get('/api/persons', (request, response)=>{
    response.json(persons)
})


const generateID = ()=>{
    const maxId = 
    persons.length > 0 ? Math.max(...persons.map((n)=> Number(n.id))) : 0
    return String(maxId + 1)
}


app.post('/api/persons', (request, response)=>{
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    if(!body.number){
        return response.status(400).json({
            error:'number is missing'
        })
    }

    const objectPerson = {
        name: body.name,
        number: body.number,
        id:generateID(),
        
    }

    persons = persons.concat(objectPerson)

    response.json(objectPerson)
})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    const person = persons.find((perso)=> perso.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    console.log(id)
    persons = persons.filter((perso)=> perso.id !== id)

    response.status(204).end()
})




const PORT = 3005

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})