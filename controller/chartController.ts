import { Router, Request, Response } from 'express'
import Tokens from '../models/tokens'
import axios from 'axios'
import Chart from '../models/chart';
import cron from 'node-cron';
import moment from 'moment-timezone';
import { authMiddleWare } from '../middleware/auth';
const router: Router = Router();


const updateChartData = async () =>
{
    try {
        const getTokens = await Tokens.find({}, 'address');
        await Promise.all(
            getTokens.map(async(token)=>
            {
         
                const response = await axios.get(`https://io-cdn.zilstream.com/chart/aggr/${token.address}`);
                const chartData:[] = response.data;
                 await Chart.findOneAndUpdate({
                    address: token.address
                },{
                    $set:{
                        updated_at: moment.tz("Asia/Manila").format(),
                        dataset: chartData
                    }
                }).exec((error)=>
                {
                    if(error)
                    {
                        console.log(error)
                    }
                })
            })
        )
        console.log("Updated successful")
        
    } catch (error) {
        console.log("Update chart data error")
    }
}

const chartTask = cron.schedule('*/30 * * * *', () => {
    updateChartData()
    console.log('Update chart Data every 30 minutes');
}, { scheduled: false });

router.post("/token/seedChart",authMiddleWare, async (req: Request, res: Response) => {
        try {
            const getTokens = await Tokens.find({}, 'address');
            const chartData = await Promise.all(
                getTokens.map(async(token)=>
                {
                        const response = await axios.get(`https://io-cdn.zilstream.com/chart/aggr/${token.address}`);
                        const chartData = response.data;
                        return {
                            address: token.address,
                            updated_at: moment.tz("Asia/Manila").format(),
                            dataset: chartData
                          }
                })
                
            )
            await Chart.insertMany(chartData);
            res.send({ Success: "Chart data created successfully" })
        } catch (error) {
            res.status(500).json({ Error: "Error getting response from external API" })
        }
})

router.post("/chart/:tokenAddress", authMiddleWare, async (req: Request, res: Response) => {
    try {
        const response = await axios.get(`https://io-cdn.zilstream.com/chart/aggr/${req.params.tokenAddress}`);
        const chartData = response.data;
        const chart = new Chart({
            address: req.params.tokenAddress,
            updated_at: moment.tz("Asia/Manila").format(),
            dataset: chartData
        });
        await chart.save();
        res.send({ Success: "Chart data created successfully" })
    } catch (error) {
        res.status(500).json({ Error: "Error getting response from external API" })
    }
})

router.get("/chart/:tokenAddress", async(req: Request, res: Response)=>{
    try{
        const getChart = await Chart.findOne({address: req.params.tokenAddress})
        
        if (getChart) {
            return res.status(200).json({ data: getChart });

        }
        else {
            return res.status(200).json({ data: "No chart data found" });
        }
    } catch (error) {
        res.status(500).json({ Error: "Error retriving token" })
    }
})

router.delete("/delete/chart/:tokenAddress", authMiddleWare, async (req: Request, res: Response) => { // update details
    try {
        const findChartDataAndDelete = await Chart.findOneAndDelete({ address: req.params.tokenAddress });

        if (findChartDataAndDelete) {
            return res.status(200).json({ Success: `${findChartDataAndDelete.address} deleted successfully` });
        }
        else {
            return res.status(200).json({ data: "No chart data found, unable to delete" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ Error: "Error deleting token" })
    }
})

export default router
export { chartTask }