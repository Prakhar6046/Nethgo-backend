import mongoose from "mongoose";
const CompanySchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      lowercase: true,
    },
    password: {
      type: String,
      require:true
    },
    name:{
      type: String,
      require:true
    },
    surname: {
      type: String,
      require:true
    },

    companyName:{
      type:String,
      require:true
    },
    piva:{
      type:String,
      require:true
    },
    address:{
      type:String,
      require:true
    },
    city:{
      type:String,
      require:true
    },
    pec:{
      type:String,
      require:true
    },
    sdi:{
      type:String,
      require:true
    }

  
});

export const CompanyModel = mongoose.model("companys", CompanySchema);
