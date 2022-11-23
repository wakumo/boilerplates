import useNetworkListener from "@/hooks/use-network-listener";
import useSwitchOrAddNetwork from "@/hooks/use-switch-network";
import { Box, Button, Typography } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { showErrorMessage } from "helpers/error-helper";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NETWORK_CHAIN_IDS } from "utils/chains";
import injected from "utils/wallet-connector";
import AccountState from "./account-state";
import { RootState } from "redux/store";

declare var window: any;

export function ConnectWallet() {
  const { active, account, error, activate, deactivate } = useWeb3React();
  const [callConnect, setCallConnect] = useState(false);
  const { chainId } = useNetworkListener();
  const currentChainId = useSelector(
    (state: RootState) => state.network.currentChainId
  );
  const isConnected = JSON.parse(
    localStorage.getItem("isConnected") || "false"
  );

  const switchOrAddNetwork = useSwitchOrAddNetwork();

  useEffect(() => {
    const checkWalletIsConnected = async () => {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length <= 0) {
        disconnect();
      } else if (isConnected && !active) {
        await activate(injected);
      }
    };

    checkWalletIsConnected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleChainUnsupportedError = async () => {
      if (!callConnect) return;
      try {
        const result = await switchOrAddNetwork(Number(currentChainId));
        if (typeof result === "object") {
          if (result.code) showErrorMessage(result);
        }
      } catch (ex) {
        console.log(`error: ${ex}`);
      }
    };

    if (error) {
      if (
        `${error}`.includes("UnsupportedChainIdError") ||
        error.name === "UnsupportedChainIdError" ||
        `${error}`.includes("Unsupported chain id")
      ) {
        handleChainUnsupportedError();
      } else {
        showErrorMessage(error);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  useEffect(() => {
    if (chainId !== null && !NETWORK_CHAIN_IDS.includes(chainId)) {
      disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId]);

  async function connectOnClick() {
    if (!window.ethereum) {
      window.open("https://metamask.io/download/", "_blank");
    } else {
      setCallConnect(true);
      try {
        await activate(injected);
        localStorage.setItem("isConnected", JSON.stringify(true));
        setCallConnect(false);
      } catch (ex) {
        showErrorMessage(ex);
        setCallConnect(false);
      }
    }
  }

  async function disconnect() {
    try {
      deactivate();
      localStorage.removeItem("isConnected");
    } catch (ex) {
      console.log(ex);
    }
  }

  console.log(active, account);

  return (
    <Box>
      {active ? (
        <AccountState account={account} disconnect={disconnect} />
      ) : (
        <Button variant="contained" onClick={connectOnClick}>
          <Typography>Connect Wallet</Typography>
        </Button>
      )}
    </Box>
  );
}
