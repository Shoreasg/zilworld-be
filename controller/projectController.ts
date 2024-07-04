import { Router, Request, Response } from "express";
import moment from "moment-timezone";
import { authMiddleWare } from "../middleware/auth";
import Projects from "../models/projects";
import newProjects from "../models/newProjects";
const router: Router = Router();

// const updateTokensSchema = async () => {
//   try {
//     const projects = await Projects.find({});

//     for (const project of projects) {
//       const oldTokens = project.tokens.map((oldToken) => ({
//         tokenAddress: oldToken ? oldToken : "",
//         zilworldURL: "",
//         tokenCategory: "",
//         tokenLogo: "",
//       }));

//       const newProject = new newProjects({
//         name: project.name,
//         description: project.description,
//         announcements: project.announcements,
//         icon: project.icon,
//         updated_at: project.updated_at,
//         category: project.category,
//         tokens: [...oldTokens],
//         NFT_address: project.NFT_address,
//         marketplace_arky: project.marketplace_arky,
//         marketplace_zildex: project.marketplace_zildex,
//         marketplace_cathulu: project.marketplace_cathulu,
//         website: project.website ? [{ websiteURL: project.website }] : undefined,
//         telegram: project.telegram ? [{ telegramURL: project.telegram }] : undefined,
//         discord: project.discord ? [{ discordURL: project.discord }] : undefined,
//         viewblock: [],
//         whitepaper: [],
//         github: [],
//         medium: [],
//         linkedin: [],
//         youtube: [],
//         reddit: [],
//         facebook: [],
//         related: [],
//         isActive: project.isActive,
//         isBuilding: project.isBuilding,
//         isNew: project.isNew,
//       });

//       await newProject.save();
//     }
//     console.log("Schema updated successfully");
//   } catch (error) {
//     console.error(error);
//   }
// };

// updateTokensSchema();

//This script is to update the schema with array category

// const updateCategorySchema = async () => {
//     try {
//       const projects = await Projects.find({});
//       projects.forEach(async project => {
//         const newCategory = [project.category.toString()];
//         await Projects.updateOne({ _id: project._id }, { $set: { category: newCategory } });
//       });
//       console.log("Schema updated successfully");
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   updateCategorySchema();

// This script is to update the schema with additional parameters which is isActive, isBuilding and isNew

//   const updateSchema = async () =>
//   {
//     try {
//         await Projects.updateMany({}, { $set: {isActive: true, isBuilding: false, isNew: false} });
//         console.log("Schema updated successfully");
//       } catch (error) {
//         console.error(error);
//       }
//   }

//   updateSchema();

// update announcement schema script

// const updateAnnouncementSchema = async () => {
//   try {
//     const projects = await newProjects.find({});
//     if (projects.length === 0) {
//       console.log("No projects found");
//       return;
//     }

//     console.log(`Found ${projects.length} projects`);

//     for (const project of projects) {
//       let updated = false;
//       for (const announcement of project.announcements) {
//         if (announcement.pinned === undefined) {
//           announcement.pinned = false;
//           updated = true;
//         }
//       }

//       if (updated) {
//         await project.save();
//         console.log(`Updated project with id: ${project._id}`);
//       } else {
//         console.log(`No updates needed for project with id: ${project._id}`);
//       }
//     }

//     console.log("Schema updated successfully");
//   } catch (error) {
//     console.error(error);
//   }
// };

// updateAnnouncementSchema();

router.get("/projects", async (req: Request, res: Response) => {
  try {
    const projects = await newProjects.find({});
    if (projects.length > 0) {
      return res.status(200).json({ data: projects });
    } else {
      return res.status(200).json({ data: "No projects found" });
    }
  } catch (error) {
    res.status(500).json({ Error: "Error retriving projects" });
  }
});

router.get("/projects/:name", async (req: Request, res: Response) => {
  try {
    const projects = await newProjects.findOne({ name: req.params.name });
    if (projects) {
      return res.status(200).json({ data: projects });
    } else {
      return res.status(200).json({ data: "No projects found" });
    }
  } catch (error) {
    res.status(500).json({ Error: "Error retriving projects" });
  }
});

router.post(
  "/projects/create",
  authMiddleWare,
  async (req: Request, res: Response) => {
    try {
      const newProject = await newProjects.create({
        ...req.body,
        updated_at: moment.tz("Asia/Manila").format(),
      });

      return res
        .status(200)
        .json({ Success: `${newProject.name} created successfully` });
    } catch (error) {
      res.status(500).json({ Error: "Error creating new project" });
    }
  }
);

router.put(
  "/projects/update/:name",
  authMiddleWare,
  async (req: Request, res: Response) => {
    try {
      const updateProject = await newProjects.findOneAndUpdate(
        { name: req.params.name },
        {
          $set: {
            ...req.body,
            updated_at: moment.tz("Asia/Manila").format(),
          },
        }
      );
      if (updateProject) {
        return res
          .status(200)
          .json({ Success: `${updateProject.name} updated successfully` });
      }
    } catch (error) {
      res.status(500).json({ Error: "Error updating project" });
    }
  }
);

router.put(
  "/projects/update/announcement/:name",
  authMiddleWare,
  async (req: Request, res: Response) => {
    try {
      const {title, preview, pinned} = req.body;

      if (!title || !preview || pinned === undefined) {
        return res.status(400).json({ Error: "All fields (title, preview, pinned) are required" });
      }

      const project = await newProjects.findOne({name: req.params.name});

      if(!project){
        return res.status(404).json({ Error: "Project not found" }); 
      }

        // Find the announcement index
        const announcementIndex = project.announcements.findIndex(a => a.title === title);
        const currentTime = moment.tz("Asia/Manila").format();

        if (announcementIndex !== -1) {
          // Update existing announcement
          project.announcements[announcementIndex].title = title;
          project.announcements[announcementIndex].preview = preview;
          project.announcements[announcementIndex].pinned = pinned;
          project.announcements[announcementIndex].updated_at = currentTime;
        } else {
          // Add new announcement
          project.announcements.push({
            title,
            preview,
            pinned,
            created_at: currentTime,
            updated_at: currentTime
          });
        }
  
        await project.save();
  
        res.status(200).json({ Success: `${req.params.name} announcement updated successfully` });


    } catch (error) {
      res.status(500).json({ Error: "Error updating project" });
    }
  }
);

router.delete(
  "/projects/delete/:name",
  authMiddleWare,
  async (req: Request, res: Response) => {
    try {
      const deleteProject = await newProjects.findOneAndDelete({
        name: req.params.name,
      });
      if (deleteProject) {
        return res
          .status(200)
          .json({ Success: `${deleteProject.name} deleted successfully` });
      }
    } catch (error) {
      res.status(500).json({ Error: "Error deleting project" });
    }
  }
);

export default router;
