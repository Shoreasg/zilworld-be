import mongoose, { Schema } from "mongoose";

const categoriesSchema = new Schema(
    {
        name:{type: String, required: true},
        numClicks:{type: Number},
        numCategories:{type: Number, required: true}
    }
)


export default mongoose.model('ProjectCategories', categoriesSchema);