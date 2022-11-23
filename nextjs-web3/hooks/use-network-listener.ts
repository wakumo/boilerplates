import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setCurrentChainId, setAccountList } from "redux/slices/network-slice";
import { NETWORK_CHAIN_IDS } from "utils/chains";

declare var window: any;
const useNetworkListener = () => {
  const [chainId, setChainId] = useState<number | null>(null);
  const dispatch = useDispatch();
  const provider = window.ethereum;

  useEffect(() => {
    if (!provider) return;
    if (provider) {
      updateChainId(0);
    }

    provider.on("chainChanged", function (networkId: string) {
      updateChainId(parseInt(networkId, 16));
    });

    provider.on("accountsChanged", function (accounts: Array<string>) {
      dispatch(setAccountList(accounts));
      if (accounts.length <= 0) {
        localStorage.removeItem("isConnected");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateChainId = async (chainId: number) => {
    if (chainId === 0) {
      const networkId = await provider.request({ method: "eth_chainId" });
      chainId = parseInt(networkId, 16);
    }
    setChainId(chainId);
    if (NETWORK_CHAIN_IDS.indexOf(chainId) >= 0) {
      dispatch(setCurrentChainId(chainId));
    } else {
      dispatch(setCurrentChainId(NETWORK_CHAIN_IDS[0]));
    }
  };

  return { chainId };
};

export default useNetworkListener;
