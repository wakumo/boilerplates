import { EmptyLayout } from "@/components/layout";
import { CacheProvider } from "@emotion/react";
import { Web3Provider } from "@ethersproject/providers";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Web3ReactProvider } from "@web3-react/core";
import Head from "next/head";
import PropTypes from "prop-types";
import * as React from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/lib/persistStore";
import { AppPropsWithLayout } from "../models";
import { store } from "../redux/store";
import "../styles/globals.css";
import { lightTheme as theme } from "../styles/theme";
import createEmotionCache from "../utils/create-emotion-cache";

const persistor = persistStore(store);

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 12000;
  return library;
}

export default function MyApp(props: AppPropsWithLayout) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const Layout = Component?.Layout ?? EmptyLayout;
  return (
    <>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider theme={theme}>
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              <Web3ReactProvider getLibrary={getLibrary}>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </Web3ReactProvider>
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </CacheProvider>
      <ToastContainer
        limit={3}
        autoClose={2000}
        position="top-right"
        hideProgressBar
        draggable
        pauseOnHover
        closeOnClick
        newestOnTop
        style={{ width: "400px" }}
        toastStyle={{ backgroundColor: "#F0F8FF" }}
      />
    </>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
