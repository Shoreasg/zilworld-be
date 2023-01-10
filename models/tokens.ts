import mongoose, { Schema } from "mongoose";


const marketDataSchema = new Schema({
    usd_rate: {type: Number, required: true},
    ath: {type: Number, required: true},
    atl:{type: Number, required: true},
    change_24h:{type: Number, required: true},
    low_24h:{type: Number, required: true},
    high_24h:{type: Number, required: true},
    change_percentage_24h:{type: Number, required: true},
    change_percentage_7d:{type: Number, required: true},
    initial_supply:{type: Number, required: true},
    max_supply:{type: Number, required: true},
    total_supply:{type: Number, required: true},
    current_supply:{type: Number, required: true},
    daily_volume_usd:{type: Number, required: true},
    market_cap_usd:{type: Number, required: true},
    fully_diluted_marketcap_usd:{type: Number, required: true},
})

const tokensSchema = new Schema({
    name: {type:String, required: true},
    symbol: {type: String, required: true},
    address: {type: String, required: true},
    icon: {type: String, required: true},
    decimals: {type: Number, required: true},
    description: {type: String},
    website: {type:String},
    telegram: {type:String},
    twitter: {type:String},
    discord: {type:String},
    marketdata: marketDataSchema
});

export default mongoose.model('Tokens', tokensSchema);