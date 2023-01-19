import { Router, Request, Response } from 'express'
import Tokens from '../models/tokens'
import axios from 'axios'
import Chart from '../models/chart';
const router: Router = Router();

router.post("/token/chart",async (req: Request, res: Response) => {
    const authorization = req.headers.authorization;
    if (authorization === process.env.APIKEY) {
        try {
            const getTokens = await Tokens.find({}, 'address');
            await Promise.all(
                getTokens.map(async(token)=>
                {
                    try{
                        const response = await axios.get(`https://io-cdn.zilstream.com/chart/aggr/${token.address}`);
                        const chartData = response.data;
                        const chart = await Chart.create({
                            address: token.address,
                            dataset: chartData
                        }).then(() => res.send({ Success: "Chart data created successfully" })).catch((error) => {
                            res.status(500).json({ Error: "Error saving data" })
                        });
                    }
                    catch(error)
                    {
                        res.status(500).json({ Error: "Error getting data from external API" })
                    }
                })
            )
        } catch (error) {
            console.log(error)
        }
    }
    else{
        res.status(401).json({ Error: "Unauthorized" });
    }
})

export default router