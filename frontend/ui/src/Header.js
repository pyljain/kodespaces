import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

const Header = (props) => (
  <AppBar position="static" style={{ backgroundColor: "#82ccdd" }}>
    <Toolbar>
      <Typography variant="h6" style={{ flexGrow: 1, textAlign: "left" }}>
        Kodespaces
      </Typography>
      <Button
        variant="contained"
        style={{ backgroundColor: "#f6b93b" }}
        onClick={props.onCreateProject}
      >
        Create Project
      </Button>
    </Toolbar>
  </AppBar>
);

export default Header;
