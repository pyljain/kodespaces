import React from "react";
import "./App.css";
import Header from "./Header";
import ProjectCard from "./ProjectCard";
import Grid from "@material-ui/core/Grid";
import AddProject from "./AddProject";

function App() {
  const [projects, setProjects] = React.useState([]);
  const [showProjectDialog, setShowProjectDialog] = React.useState(false);

  const fetchProjects = async () => {
    console.log("Calling API");
    const response = await fetch("/projects");
    const resJSON = await response.json();
    setProjects(resJSON);
    console.log(resJSON);
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const createProject = async (project) => {
    const res = await fetch('/project', {
      method: "POST",
      body: JSON.stringify(project),
      headers: {
        "Content-Type": "application/json"
      }
    })

    setShowProjectDialog(false)

    if (res.status === 201) {
      // refresh UI
      await fetchProjects()
    }
  };

  return (
    <div className="App">
      <Header onCreateProject={() => setShowProjectDialog(true)} />
      {showProjectDialog
        ? <AddProject
          onClose={() => setShowProjectDialog(false)}
          onProjectCreate={(project) => createProject(project)}
        />
        : ""}
      <div style={{ padding: "10px" }}>
        <Grid container spacing={2}>
          {projects.map((project) => {
            return (
              <Grid item xs={4}>
                <ProjectCard project={project} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

export default App;
