import { InjectedConnector } from "@web3-react/injected-connector";
import { NETWORK_CHAIN_IDS } from "./chains";

const injected = new InjectedConnector({
  supportedChainIds: NETWORK_CHAIN_IDS,
});

export default injected;
