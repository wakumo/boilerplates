import { Box, Typography } from "@mui/material";
import * as React from "react";

export function Footer() {
  return (
    <Box py={2}>
      <Typography variant="body1" color="text.secondary" align="center">
        {"Copyright © "}
        {new Date().getFullYear()}
        {" Kopi. All right reserved."}
      </Typography>
    </Box>
  );
}
