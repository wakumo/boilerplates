import { red } from "@mui/material/colors";
import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export let lightTheme = createTheme({
  // typography: {
  //   fontFamily: ""
  // }, // change default font
  palette: {
    mode: "light",
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    error: {
      main: red.A400,
    },
  },
  components: {
    // MuiContainer: {
    //   defaultProps: {},
    //   styleOverrides: {
    //     maxWidthSm: ""
    //   }
    // }
    MuiLink: {
      defaultProps: {
        underline: "hover",
      },
      styleOverrides: {
        root: {
          color: "black",
          "&:hover": {
            color: "#556cd6"
          }
        }
      }
    },
  }, // custom component
});

lightTheme = responsiveFontSizes(lightTheme); // change font size by break point
