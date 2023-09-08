import { Router, Request, Response } from 'express'
import ProjectCategories from '../models/projectCategories';
import { authMiddleWare } from '../middleware/auth';
import Projects from '../models/projects';

const router: Router = Router();


router.get("/ProjectCategories", async(req: Request, res:Response)=>{
    try {
        const categories = await ProjectCategories.find({});

        return res.status(200).json({data: categories});
    }
    catch(error){
        res.status(500).json({ Error: "Error retriving Project Categories" })
    }
})

router.post("/ProjectCategories/create",authMiddleWare, async(req: Request, res:Response)=>{
    try {

        const projects = await Projects.find({category:{$in:[req.body.name]}});


        const newCategory = await ProjectCategories.create({
           name: req.body.name,
           numClicks: 0,
           numCategories: projects.length
        })

        return res.status(200).json({ Success: `${newCategory.name} created successfully` });
        
    } catch (error) {
        res.status(500).json({ Error: "Error Creating Project Categories due to", Message: error })
    }
})

router.put("/ProjectCategories/update", authMiddleWare, async(req:Request , res:Response)=>{
    try {

        const updateClicks = await ProjectCategories.findOneAndUpdate({name: req.body.name},{
            $inc:{numClicks: 1}
        })

        if(!updateClicks){
           return res.status(500).json({ Error: "Error updating number of clicks for Project Categories"})
        }

        return res.status(200).json({ Success: `${updateClicks.name} number of clicks updated successfully` });
        
    } catch (error) {
        res.status(500).json({ Error: "Error updating number of clicks for Project Categories", Message: error })
    }
})


router.delete("/ProjectCategories/delete",authMiddleWare,async(req:Request , res:Response)=>{
    try {
        const deleteCategory = await ProjectCategories.findOneAndDelete({name: req.body.name})
        if(deleteCategory)
        {
            return res.status(200).json({ Success: `${deleteCategory.name} deleted successfully` });
        }
    } catch (error) {
        res.status(500).json({ Error: "Error deleting Project Categories",Message: error });
    }
})


export default router