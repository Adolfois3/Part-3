const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connected to MongoDB', url)


mongoose.connect(url)
.then(result =>{
  console.log("Connecte to mongoDB")
}).catch(error=>{
  console.log(error.message)
})

const persoSchema = new mongoose.Schema({
  name:String,
  number:String
})

persoSchema.set('toJSON', {
  transform:(document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Perso', persoSchema)



