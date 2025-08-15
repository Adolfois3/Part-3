require("dotenv").config()

const express = require("express")
const app = express()
const morgan = require("morgan")
const cors = require('cors')

const perso = require('./mongo')


let persons = []


app.use(express.static('dist'))
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


app.get('/gestor', (request, response)=>{
    response.sendFile(__dirname + '/dist/index.html')
})


app.get('/api/persons', (request, response)=>{
    perso.find({}).then(persos =>{
        response.json(persos)
    })
})

app.post('/api/persons', (request, response, next)=>{
    const body = request.body

    const personn = new perso({
        name:body.name,
        number:body.number
    })

    personn.save().then(savedPerso =>{
        response.json(savedPerso)
    })
    .catch(error => next(error))
})

const unknownEndPoint = (request ,response)=>{
   response.status(404).send({error:"unknownEndPoint"})
}


const errorHandler = (error, request,response,next)=>{
console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}



app.get('/api/persons/:id', (request, response)=>{
    perso.findById(request.params.id)
    .then(perso =>{
        if(perso){
            response.json(perso)
        }else{
            response.status(404).end()
        }
    }).catch(error => next(error))        
    
})

app.delete('/api/persons/:id', (request, response)=>{
    perso.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()  
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response) =>{
    const {name, number} = request.body

    perso.findByIdAndUpdate(
        request.params.id,
    )
    .then((perso)=>{
        if(!perso){
            return response.status(404).end()
        }
        perso.name = name,
        perso.number = number

        return perso.save().then((updatePerso)=>{
            response.json(updatePerso)
        })
    })
    .catch((error)=> next(error))
})



app.use(unknownEndPoint)
app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})