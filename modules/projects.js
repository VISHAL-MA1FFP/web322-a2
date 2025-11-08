const fs = require('fs');
const path = require('path');

let projects = [];
let sectorsCache = [];

/** Initialize by loading JSON and joining sector names */
function initialize() {
  return new Promise((resolve, reject) => {
    const dataPath = path.join(__dirname, '../data');

    fs.readFile(path.join(dataPath, 'projects.json'), 'utf8', (err, projRaw) => {
      if (err) return reject('Unable to read projects file');

      fs.readFile(path.join(dataPath, 'sectors.json'), 'utf8', (err2, secRaw) => {
        if (err2) return reject('Unable to read sectors file');

        try {
          const projectsData = JSON.parse(projRaw);
          sectorsCache = JSON.parse(secRaw);

          // attach sectorName to every project
          projects = projectsData.map(p => {
            const sector = sectorsCache.find(s => Number(s.id) === Number(p.sector_id));
            return {
              ...p,
              sectorName: sector ? sector.sector_name : 'Unknown'
            };
          });

          resolve();
        } catch {
          reject('Unable to parse data files');
        }
      });
    });
  });
}

/** Get all projects */
function getAllProjects() {
  return new Promise((resolve, reject) => {
    if (!projects.length) return reject('No projects available');
    resolve(projects);
  });
}

/** Get project by numeric id */
function getProjectById(projectId) {
  return new Promise((resolve, reject) => {
    const id = Number(projectId);
    const project = projects.find(p => Number(p.id) === id);
    project ? resolve(project) : reject('Unable to find requested project');
  });
}

/**
 * Get projects by sector (accepts sector id OR sector name)
 *   getProjectsBySector(3) or "3" (by id),
 *   getProjectsBySector("Transportation") (by name, case-insensitive/partial)
 */
function getProjectsBySector(sector) {
  return new Promise((resolve, reject) => {
    if (!projects.length) return reject('No projects available');

    let list = [];
    if (!isNaN(Number(sector))) {
      const sid = Number(sector);
      list = projects.filter(p => Number(p.sector_id) === sid);
    } else if (typeof sector === 'string') {
      const term = sector.toLowerCase().trim();
      list = projects.filter(p => (p.sectorName || '').toLowerCase().includes(term));
    }

    list.length ? resolve(list) : reject('Unable to find requested projects');
  });
}

/** Expose sectors for navbar dropdown */
function getAllSectors() {
  return Promise.resolve(sectorsCache);
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  getAllSectors
};


