import { LayoutProps } from "@/models/index";
import * as React from "react";
import { Stack } from "@mui/material";
import { Box } from "@mui/system";
import { Header, Footer } from "../common";

export function MainLayout({ children }: LayoutProps) {
  return (
    <Stack minHeight={"100vh"}>
      <Header />
      <Box flexGrow={1}>{children}</Box>
      <Footer />
    </Stack>
  );
}
