import { createTheme, responsiveFontSizes } from "@mui/material/styles";

export let darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

darkTheme = responsiveFontSizes(darkTheme);
