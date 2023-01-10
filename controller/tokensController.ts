import express, { Router, Request, Response } from 'express'
import Tokens from '../models/tokens'
import axios from 'axios'
import e from 'express';
const router: Router = express.Router();

interface IMarketdata {
    rate_usd: number,
    ath: number,
    atl: number,
    change_24h: number,
    low_24h: number,
    high_24h: number,
    change_percentage_24h: number,
    change_percentage_7d: number,
    init_supply: number,
    max_supply: number,
    total_supply: number,
    current_supply: number,
    daily_volume_usd: number,
    market_cap_usd: number,
    fully_diluted_valuation_usd: number,

}

interface ITokens {
    name: string,
    symbol: string,
    address: string,
    icon: string,
    decimals: number,
    description: string,
    website: string,
    telegram: string,
    twitter: string,
    discord: string,
    market_data: IMarketdata
}


router.post("/seedtoken", async (req: Request, res: Response) => {
    const authorization = req.headers.authorization;
    if (authorization === process.env.APIKEY) {
        try {

            const response = await axios.get("https://io.zilstream.com/tokens");
            const tokens: [] = response.data;
            const tokensToSave = tokens.map((token: ITokens) => {
                return {
                    name: token.name,
                    symbol: token.symbol,
                    address: token.address,
                    icon: token.icon,
                    decimals: token.decimals,
                    description: "",
                    website: token.website,
                    telegram: token.telegram,
                    discord: token.discord,
                    marketdata: {
                        usd_rate: token.market_data.rate_usd,
                        ath: token.market_data.ath,
                        atl: token.market_data.atl,
                        change_24h: token.market_data.change_24h,
                        low_24h: token.market_data.low_24h,
                        high_24h: token.market_data.high_24h,
                        change_percentage_24h: token.market_data.change_percentage_24h,
                        change_percentage_7d: token.market_data.change_percentage_7d,
                        initial_supply: token.market_data.init_supply,
                        max_supply: token.market_data.max_supply,
                        total_supply: token.market_data.total_supply,
                        current_supply: token.market_data.current_supply,
                        daily_volume_usd: token.market_data.daily_volume_usd,
                        market_cap_usd: token.market_data.market_cap_usd,
                        fully_diluted_marketcap_usd: token.market_data.fully_diluted_valuation_usd,
                    }
                }
            })
            await Tokens.create(tokensToSave).then(() => res.send({ Success: "Tokens data created successfully" })).catch((error) => {
                res.status(500).json({ Error: "Error saving data" })
            });

        } catch (error) {
            res.status(500).json({ Error: "Error getting response from external API" })
        }
    }
    else {
        res.status(401).json({ Error: "Unauthorized" });
    }
})

export default router