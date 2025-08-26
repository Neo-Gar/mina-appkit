import { useEffect } from "react";
import { useAccountStore } from "../store/accountStore";

/**
 * Current supported networks
 */
export enum NetworkID {
  MINA_MAINNET = "mina:mainnet",
  MINA_DEVNET = "mina:devnet",
  ZEKO_TESTNET = "zeko:testnet",
}

/**
 * Interface for Mina wallet provider (Auro Wallet)
 */
interface MinaProvider {
  getAccounts: () => Promise<string[]>;
  requestAccounts: () => Promise<string[]>;
  requestNetwork: () => Promise<{ networkID: NetworkID | string }>;
  on: (event: string, callback: (accounts: string[]) => void) => void;
  removeListener: (event: string, callback: Function) => void;
}

declare global {
  interface Window {
    mina?: MinaProvider;
  }
}

/**
 * React hook for integrating with Mina blockchain wallet (Auro Wallet)
 *
 * @returns {Object} Hook state and methods
 * @returns {string | undefined} address - Currently connected wallet address
 * @returns {boolean} isConnected - Whether wallet is connected
 * @returns {string | undefined} networkID - Current network identifier
 * @returns {boolean} isWalletInstalled - Whether Auro Wallet is installed
 * @returns {Function} triggerWallet - Function to connect wallet
 *
 * @example
 * ```tsx
 * import { useMinaAppkit } from 'mina-appkit';
 *
 * function MyComponent() {
 *   const { address, isConnected, triggerWallet } = useMinaAppkit();
 *
 *   return (
 *     <div>
 *       {isConnected ? (
 *         <p>Connected: {address}</p>
 *       ) : (
 *         <button onClick={triggerWallet}>Connect Wallet</button>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMinaAppkit(
  { autoConnect }: { autoConnect: boolean } = { autoConnect: false }
) {
  const {
    address,
    isConnected,
    networkID,
    isWalletInstalled,
    setNetworkID,
    setIsWalletInstalled,
    setConnectionState,
    resetStore,
    validateAndUpdateConnection,
  } = useAccountStore();

  /**
   * Internal function to handle account fetching and state updates
   * Retrieves current accounts from the wallet and updates connection state
   *
   * @internal
   */
  const handleAccount = async () => {
    try {
      const accounts = await window.mina?.getAccounts();
      if (accounts && accounts[0]) {
        setConnectionState(accounts[0], true);
      } else {
        setConnectionState(undefined, false);
      }
    } catch (error) {
      console.log("[Mina Appkit]: Error getting accounts", error);
      setConnectionState(undefined, false);
    }
  };

  /**
   * Validates current connection against wallet state
   * Checks if saved address is still valid and updates store accordingly
   *
   * @internal
   */
  const validateConnection = async () => {
    if (!window.mina) return;

    try {
      const accounts = await window.mina.getAccounts();
      validateAndUpdateConnection(accounts || []);
    } catch (error) {
      console.log("[Mina Appkit]: Error validating connection", error);
      // If there is an error, reset the connection
      resetStore();
    }
  };

  /**
   * Triggers wallet connection flow
   * Requests user permission to connect accounts and updates state accordingly
   *
   * @returns {Promise<string | undefined>} Promise that resolves to connected address or undefined
   *
   * @example
   * ```tsx
   * const handleConnect = async () => {
   *   const address = await triggerWallet();
   *   if (address) {
   *     console.log('Connected to:', address);
   *   }
   * };
   * ```
   */
  const triggerWallet = async (): Promise<string | undefined> => {
    try {
      if (!window.mina) {
        console.log("[Mina Appkit]: Wallet not installed");
        return undefined;
      }

      const accounts = await window.mina.requestAccounts();
      if (accounts && accounts[0]) {
        setConnectionState(accounts[0], true);
        return accounts[0];
      }
    } catch (error) {
      console.log("[Mina Appkit]: Error requesting accounts", error);
    }
    return undefined;
  };

  /**
   * Internal function to request and update network information
   * Fetches current network details from the wallet
   *
   * @internal
   */
  const requestNetwork = async () => {
    try {
      if (!window.mina) return;

      const network = await window.mina.requestNetwork();
      if (network && network.networkID) {
        setNetworkID(network.networkID);
      }
    } catch (error) {
      console.log("[Mina Appkit]: Error requesting network", error);
    }
  };

  const disconnect = () => {
    resetStore();
  };

  useEffect(() => {
    const checkWallet = () => {
      if (typeof window !== "undefined" && window.mina) {
        if (!isWalletInstalled) {
          setIsWalletInstalled(true);
          console.log("[Mina Appkit]: Auro Wallet is installed!");
        }

        // Watch for account changes
        const accountChangeHandler = (accounts: string[]) => {
          console.log("[Mina Appkit]: Accounts changed", accounts);
          if (accounts[0]) {
            setConnectionState(accounts[0], true);
          } else {
            setConnectionState(undefined, false);
          }
        };

        window.mina.on("accountsChanged", accountChangeHandler);

        // Always validate the saved connection state
        if (address && isConnected) {
          console.log("[Mina Appkit]: Validating saved connection state");
          validateConnection();
        }

        if (autoConnect) {
          handleAccount();
          requestNetwork();
        }

        return () => {
          if (window.mina?.removeListener) {
            window.mina.removeListener("accountsChanged", accountChangeHandler);
          }
        };
      } else {
        console.log("[Mina Appkit]: Auro Wallet is not installed");
        setIsWalletInstalled(false);
      }
    };

    checkWallet();
  }, [isWalletInstalled]);

  return {
    /**
     * The address of the connected wallet
     */
    address,
    /**
     * Whether the wallet is connected
     */
    isConnected,
    /**
     * The network ID of the connected wallet
     */
    networkID,
    /**
     * Whether the wallet is installed
     */
    isWalletInstalled,
    /**
     * Triggers the wallet connection flow
     */
    triggerWallet,
    /**
     * Disconnects the wallet
     */
    disconnect,
  };
}
