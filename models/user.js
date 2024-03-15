const mongoose = require('mongoose')
const DB ="mongodb+srv://vebpath:DfyOoEePJ0cfCUrS@vebpath.n0fpsbf.mongodb.net/test";
mongoose.set("strictQuery", false);


mongoose.connect(DB);
const userSchema =  mongoose.Schema({

   username:{
    type: String,
    required: true,
   },
   email:{
    type: String,
    required: true,
    unique: true,
   },
   phone:{
    type: Number,
    required: true,
   },
   
   password:{
    type: String,
    required: true,
   },
   registrationDate: {
    type: String,
    default: () => {
      const date = new Date();
      const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
      return date.toLocaleDateString('en-IN', options);
    }
  },

})


module.exports = mongoose.model("register" ,userSchema)