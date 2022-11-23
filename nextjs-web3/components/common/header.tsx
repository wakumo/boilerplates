import { Box, Typography, Button, Stack, Container } from "@mui/material";
import * as React from "react";
import { ConnectWallet } from "./connect-wallet";

export function Header() {
  return (
    <Box sx={{ py: 2, boxShadow: "0 0 15px rgb(5 32 73 / 15%)" }}>
      <Container>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Poter Swap
          </Typography>
          <ConnectWallet />
        </Stack>
      </Container>
    </Box>
  );
}
