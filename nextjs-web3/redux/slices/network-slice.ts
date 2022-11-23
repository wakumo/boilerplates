import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface networkState {
  currentChainId: number | null;
  currentAccount: string;
  accounts: Array<string>;
}

const initialState: networkState = {
  currentChainId: null,
  currentAccount: "",
  accounts: [],
};

export const networkSlice = createSlice({
  name: "network",
  initialState,
  reducers: {
    setCurrentChainId: (state, action: PayloadAction<number>) => {
      state.currentChainId = action.payload;
    },
    setAccountList: (state, action: PayloadAction<Array<string>>) => {
      state.accounts = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setCurrentChainId, setAccountList } = networkSlice.actions;

export default networkSlice.reducer;
