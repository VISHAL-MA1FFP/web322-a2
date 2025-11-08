// /********************************************************************************
// * WEB322 – Assignment 2
// *
// * I declare that this assignment is my own work in accordance with Seneca's
// * Academic Integrity Policy:
// * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
// *
// * Name: __Alwin Susy Jayan__   Student ID: __150324234__   Date: __11/07/2025__
// *
// ********************************************************************************/

// const express = require("express");
// const path = require("path");
// const app = express();
// const PORT = process.env.PORT || 8080;

// // Import project data functions
// const {
//   initialize,
//   getAllProjects,
//   getProjectsBySector,
//   getProjectById,
//   getAllSectors,
// } = require("./modules/projects");

// // Middleware
// app.use(express.static(path.join(__dirname, "public")));
// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));

// // Initialize data and start server
// initialize()
//   .then(() => {
//     // ---------- ROUTES ----------

//     // Home
//     app.get("/", (req, res) => {
//       res.render("home", { page: "/", title: "Home" });
//     });

//     // About
//     app.get("/about", (req, res) => {
//       res.render("about", { page: "/about", title: "About Us" });
//     });

//     // All projects (optionally filtered by ?sector=)
//     app.get("/solutions/projects", async (req, res) => {
//       try {
//         const { sector } = req.query;
//         const projects = sector
//           ? await getProjectsBySector(sector)
//           : await getAllProjects();
//         res.render("projects", {
//           page: "/projects",
//           title: "Projects",
//           projects,
//         });
//       } catch (err) {
//         res.render("projects", {
//           page: "/projects",
//           title: "Projects",
//           projects: [],
//         });
//       }
//     });

//     // Single project by ID
//     app.get("/solutions/project/:id", async (req, res) => {
//       try {
//         const project = await getProjectById(req.params.id);
//         res.render("project", {
//           page: "/project",
//           title: project.title,
//           project,
//         });
//       } catch (err) {
//         res.status(404).render("404", { title: "Not Found" });
//       }
//     });

//     // 404 fallback
//     app.use((req, res) => {
//       res.status(404).render("404", { title: "Page Not Found" });
//     });

//     // ---------- START ----------
//     app.listen(PORT, () =>
//       console.log(`Server running → http://localhost:${PORT}`)
//     );
//   })
//   .catch((err) => {
//     console.error("Error initializing projects:", err);
//   });


/********************************************************************************
* WEB322 – Assignment 2
* Name: __Alwin Susy Jayan__   Student ID: __150324234__   Date: __11/07/2025__
********************************************************************************/

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 8080;

const {
  initialize,
  getAllProjects,
  getProjectsBySector,
  getProjectById,
  getAllSectors,              // <-- add this
} = require("./modules/projects");

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Make sectors available in every view (for navbar dropdown)
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
