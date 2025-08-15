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
  name:{
    type:String,
    minLength:3,
    required: true,
  },
number: {
  type: String,
  required: [true, 'El número de teléfono es obligatorio.'],
  minLength: [8, 'El número de teléfono debe tener al menos 8 caracteres.'],
  validate: {
    validator: function(v) {
      return /^\d{2,3}-\d+$/.test(v);
    },
    message: props => `${props.value} no es un número de teléfono válido. El formato debe ser "xx-xxxxxx" o "xxx-xxxxxx".`
  },
}
  


})

persoSchema.set('toJSON', {
  transform:(document, returnedObject) =>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Perso', persoSchema)



