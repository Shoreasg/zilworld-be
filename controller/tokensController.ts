import { Router, Request, Response } from 'express'
import Tokens from '../models/tokens'
import moment from 'moment-timezone'
import axios from 'axios'
import cron from 'node-cron';
import { ITokens } from '../types/types';
const router: Router = Router();


const updateMarketData = async () => {
    try {
        const response = await axios.get(`${process.env.ZILSTREAM_URL}`);
        const tokens: ITokens[] = response.data;
        for (const token of tokens) {
            await Tokens.findOneAndUpdate({
                address: token.address
            }, {
                $set: {
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
                        updated_at: moment.tz("Asia/Manila").format()
                    }
                }
            }).exec((error) => {
                if (error) {
                    console.log(error)
                }
            })
        }
        console.log("Updated successful")
    } catch (error) {
        console.log(error)
    }
}

const task = cron.schedule('*/5 * * * *', () => {
    updateMarketData()
    console.log('Update marketData every 5 minutes');
});


router.post("/seedtoken", async (req: Request, res: Response) => { //seed data from zilstream
    const authorization = req.headers.authorization;
    if (authorization === process.env.APIKEY) {
        try {

            const response = await axios.get(`${process.env.ZILSTREAM_URL}`);
            const tokens: ITokens[] = response.data;
            const tokensToSave = tokens.map((token: ITokens) => {
                return {
                    name: token.name,
                    updated_at: "",
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
                        updated_at: ""
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
export { task }