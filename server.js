// /********************************************************************************
// * WEB322 – Assignment 2
// *
// * I declare that this assignment is my own work in accordance with Seneca's
// * Academic Integrity Policy:
// * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
// *
// * Name: __vishal sharma__   Student ID: __189273238__   Date: __11/07/2025__
// *
// ********************************************************************************/



const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

const {
  initialize,
  getAllProjects,
  getProjectsBySector,
  getProjectById,
  getAllSectors,              
} = require("./modules/projects");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use(async (req, res, next) => {
  try {
    res.locals.sectors = await getAllSectors();  // [{id, sector_name}, ...]
  } catch {
    res.locals.sectors = [];
  }
  next();
});

initialize().then(() => {

  app.get("/", (req, res) => {
    res.render("home", { page: "/", title: "Home" });
  });

  app.get("/about", (req, res) => {
    res.render("about", { page: "/about", title: "About Us" });
  });

  // /solutions/projects and optional ?sector= (id OR name)
  app.get("/solutions/projects", async (req, res) => {
    try {
      const { sector } = req.query;
      const projects = sector
        ? await getProjectsBySector(sector)
        : await getAllProjects();
      res.render("projects", { page: "/projects", title: "Projects", projects });
    } catch {
      res.render("projects", { page: "/projects", title: "Projects", projects: [] });
    }
  });

  // Single project
  app.get("/solutions/project/:id", async (req, res) => {
    try {
      const project = await getProjectById(req.params.id);
      res.render("project", { page: "/project", title: project.title, project });
    } catch {
      res.status(404).render("404", { title: "Not Found" });
    }
  });

  // 404
  app.use((req, res) => {
    res.status(404).render("404", { title: "Page Not Found" });
  });

  app.listen(PORT, () => console.log(`Server running → http://localhost:${PORT}`));
}).catch((err) => {
  console.error("Error initializing projects:", err);
});
