import mongoose, { Schema } from "mongoose";

const chartDataSchema = new Schema({
    time:{type:String, required: true},
    value:{type: Number, required: true}
})

const chartSchema = new Schema({
    address: {type:String,required: true},
    updated_at: {type: String},
    dataset: [chartDataSchema]
})


export default mongoose.model('Chart', chartSchema);