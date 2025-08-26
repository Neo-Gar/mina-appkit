import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AccountStore {
  address: string | undefined;
  isConnected: boolean;
  networkID: string | undefined;
  setNetworkID: (networkID: string | undefined) => void;
  isWalletInstalled: boolean;
  setIsWalletInstalled: (isWalletInstalled: boolean) => void;
  // Centralized actions for better control
  setConnectionState: (
    address: string | undefined,
    isConnected: boolean
  ) => void;
  resetStore: () => void;
  validateAndUpdateConnection: (currentAccounts: string[]) => void;
}

export const useAccountStore = create<
  AccountStore,
  [["zustand/persist", never]]
>(
  persist(
    (set) => ({
      address: undefined,
      isConnected: false,
      networkID: undefined,
      setNetworkID: (networkID: string | undefined) => {
        set({ networkID });
      },
      isWalletInstalled: false,
      setIsWalletInstalled: (isWalletInstalled: boolean) => {
        set({ isWalletInstalled });
      },
      setConnectionState: (
        address: string | undefined,
        isConnected: boolean
      ) => {
        set({ address, isConnected });
      },
      resetStore: () => {
        set({
          address: undefined,
          isConnected: false,
          networkID: undefined,
        });
      },
      validateAndUpdateConnection: (currentAccounts: string[]) => {
        set((state) => {
          // If there is no saved address, do nothing
          if (!state.address || !state.isConnected) {
            return state;
          }

          // Check if the saved address is among the current accounts
          const isAddressValid = currentAccounts.indexOf(state.address) !== -1;

          if (!isAddressValid) {
            console.log(
              "[AccountStore]: Saved address is no longer valid, resetting connection"
            );
            return {
              ...state,
              address: undefined,
              isConnected: false,
            };
          }

          return state;
        });
      },
    }),
    {
      name: "@MinaAppkit/account-store",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
