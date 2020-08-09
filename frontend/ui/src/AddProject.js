import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";

const AddProject = (props) => {
  const [language, setLanguage] = React.useState("Node");
  const [name, setName] = React.useState("");
  const [cpu, setCPU] = React.useState(.5);
  const [memory, setMemory] = React.useState(128);

  const projectDetails = () => {
    let project = {
      name: name,
      language: language,
      cpu: cpu,
      memory: memory,
    };

    props.onProjectCreate(project);
  };
  return (
    <div>
      <Dialog
        open={true}
        onClose={props.onClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Project</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Fill up your project details below
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Name"
            type="text"
            fullWidth
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <InputLabel
            id="demo-simple-select-helper-label"
            style={{ marginTop: "20px" }}
          >
            Language
          </InputLabel>
          <Select
            id="demo-simple-select-helper"
            fullWidth
            onChange={(e) => setLanguage(e.target.value)}
            value={language}
          >
            <MenuItem value="Go">Go</MenuItem>
            <MenuItem value="Node">Node.js</MenuItem>
            <MenuItem value="Python">Python</MenuItem>
          </Select>
          <Typography gutterBottom style={{ marginTop: "20px" }}>
            CPU
          </Typography>
          <Slider
            defaultValue={0.5}
            step={0.5}
            marks
            min={0.1}
            max={4}
            valueLabelDisplay="auto"
            onChange={(e, newValue) => setCPU(newValue)}
            value={cpu}
          />
          <Typography gutterBottom style={{ marginTop: "20px" }}>
            Memory
          </Typography>
          <Slider
            defaultValue={256}
            step={128}
            marks
            min={128}
            max={2048}
            valueLabelDisplay="auto"
            onChange={(e, newValue) => {
              setMemory(newValue)
            }}
            value={memory}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={props.onClose} color="primary">
            Cancel
          </Button>
          <Button onClick={projectDetails} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddProject;
