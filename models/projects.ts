import mongoose, { Schema } from "mongoose";



const announcementSchema = new Schema({
    title: {type:String, required: true},
    preview: {type:String, required: true},
    
})


const projectsSchema = new Schema({
    name: {type:String, required: true},
    description:{type:String, required: true},
    announcements:[announcementSchema],
    icon: {type: String, required: true},
    updated_at:{type: String},
    category:[{type:String, required: true}],
    tokens:[{type:String}],
    NFT_address:[{type:String}],
    marketplace_arky:{type: Boolean},
    marketplace_zildex:{type: Boolean},
    marketplace_cathulu:{type: Boolean},
    website: {type:String},
    telegram: {type:String},
    twitter: {type:String},
    discord: {type:String},
    isActive: {type: Boolean},
    isBuilding: {type: Boolean},
    isNew:{type: Boolean},
    

})


export default mongoose.model('Projects', projectsSchema);