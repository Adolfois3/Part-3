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

    const personn = new perso({
        name:body.name,
        number:body.number
    })

    personn.save().then(savedPerso =>{
        response.json(savedPerso)
    })
})

//const unknownEndPoint = (request ,response)=>{
//   response.status(404).send({error:"unknownEndPoint"})
//}
//app.use(unknownEndPoint)

//const errorHandler = (error, request,response,next)=>{
//    console.error(error.message)

//    if(error.name === 'castError'){
//       return response.status(400).send({error: "malFormatted id"})
 //   }
  //  next(error)
//}
//app.use(errorHandler)


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

    const body = request.body

    const perso = {
        name:body.name,
        number:body.number
    }
    perso.findByIdAndUpdate(request.params.id, perso, {new: true})
    .then(updateNumber =>{
        response.json(updateNumber)
    })
    .catch(error => next(error))
})





const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})