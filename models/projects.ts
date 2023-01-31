import mongoose, { Schema } from "mongoose";



const projectsSchema = new Schema({
    name: {type:String, required: true},
    description:{type:String, required: true},
    icon: {type: String, required: true},
    updated_at:{type: String},
    category:{type:String, required: true},
    tokens:[{type:String}],
    NFT_address:[{type:String}],
    marketplace_arky:{type: Boolean},
    marketplace_zildex:{type: Boolean},
    marketplace_cathulu:{type: Boolean},
    website: {type:String},
    telegram: {type:String},
    twitter: {type:String},
    discord: {type:String},
    

})


export default mongoose.model('Projects', projectsSchema);