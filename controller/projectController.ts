import { Router, Request, Response } from 'express'
import moment from 'moment-timezone';
import { authMiddleWare } from '../middleware/auth';
import Projects from '../models/projects';
const router: Router = Router();



const updateCategorySchema = async () => {
    try {
      const projects = await Projects.find({});
      projects.forEach(async project => {
        const newCategory = [project.category.toString()];
        await Projects.updateOne({ _id: project._id }, { $set: { category: newCategory } });
      });
      console.log("Schema updated successfully");
    } catch (error) {
      console.error(error);
    }
  };
  
  updateCategorySchema();

  const updateSchema = async () =>
  {
    try {
        await Projects.updateMany({}, { $set: {isActive: true, isBuilding: false, isNew: false} });
        console.log("Schema updated successfully");
      } catch (error) {
        console.error(error);
      }
  }

  updateSchema();

router.get("/projects", async(req: Request, res:Response)=>{
    try {
        const projects = await Projects.find({});
        if(projects.length > 0)
        {
            return res.status(200).json({ data: projects });
        }
        else{
            return res.status(200).json({ data: "No projects found" });
        }

    } catch (error) {
        res.status(500).json({ Error: "Error retriving projects" })
    }
})


router.get("/projects/:name", async(req: Request, res:Response)=>{
    try {
        const projects = await Projects.findOne({name:req.params.name});
        if(projects)
        {
            return res.status(200).json({ data: projects });
        }
        else{
            return res.status(200).json({ data: "No projects found" });
        }

    } catch (error) {
        res.status(500).json({ Error: "Error retriving projects" })
    }
})


router.post("/projects/create",authMiddleWare, async(req: Request, res:Response)=>{
    try {
        const newProjects = await Projects.create({
            ...req.body,
            updated_at: moment.tz("Asia/Manila").format()
        })

        return res.status(200).json({ Success: `${newProjects.name} created successfully` });
    } catch (error) {
        res.status(500).json({ Error: "Error creating new project" })
    }
})


router.put("/projects/update/:name",authMiddleWare, async(req: Request, res:Response)=>{
    try {
        const updateProject = await Projects.findOneAndUpdate({name: req.params.name},{
            $set:{
                ...req.body,
                updated_at: moment.tz("Asia/Manila").format()
            }
        })
        if(updateProject)
        {
            return res.status(200).json({ Success: `${updateProject.name} updated successfully` });
        }
    } catch (error) {
        res.status(500).json({ Error: "Error updating project" })
    }
})

router.delete("/projects/delete/:name",authMiddleWare, async(req: Request, res:Response)=>{
    try {
        const deleteProject = await Projects.findOneAndDelete({name: req.params.name})
        if(deleteProject)
        {
            return res.status(200).json({ Success: `${deleteProject.name} deleted successfully` });
        }
    } catch (error) {
        res.status(500).json({ Error: "Error deleting project" })
    }
})

export default router