# Mina AppKit

> ⚠️ **DISCLAIMER**: This package is **NOT** an official package from the Mina Protocol or O(1) Labs. It is an independent, community-created library for integrating with Auro Wallet and the Mina blockchain. This package is not affiliated with, endorsed by, or officially connected to Mina Protocol in any way.

A React hooks library for seamless Mina blockchain wallet integration, specifically designed to work with Auro Wallet. This library provides easy-to-use React hooks for connecting to wallets, managing account state, and interacting with the Mina blockchain.

## Features

- 🔗 **Easy Wallet Connection**: Simple one-click wallet connection with Auro Wallet
- 🎯 **React Hooks**: Clean, composable React hooks for wallet state management
- 🔄 **Auto-Connect**: Optional automatic wallet connection on app load
- 🌐 **Multi-Network Support**: Support for Mainnet, Devnet, and Zeko Testnet
- 💾 **Persistent State**: Automatic state persistence using localStorage
- 🛡️ **Address Validation**: Built-in Mina address validation utilities
- 📱 **TypeScript Support**: Full TypeScript support with comprehensive type definitions

## Installation

```bash
# Using npm
npm install mina-appkit

# Using yarn
yarn add mina-appkit

# Using pnpm
pnpm add mina-appkit
```

## Prerequisites

This library requires:

- React 16.8.0 or higher (for hooks support)

## Quick Start

### Basic Usage

```tsx
import React from "react";
import { useMinaAppkit } from "mina-appkit";

function WalletConnection() {
  const { address, isConnected, isWalletInstalled, triggerWallet, disconnect } =
    useMinaAppkit();

  if (!isWalletInstalled) {
    return (
      <div>
        <p>Please install Auro Wallet to continue</p>
        <a
          href="https://www.aurowallet.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Install Auro Wallet
        </a>
      </div>
    );
  }

  return (
    <div>
      {isConnected ? (
        <div>
          <p>Connected to: {address}</p>
          <button onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button onClick={triggerWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnection;
```

### Auto-Connect Usage

```tsx
import React from "react";
import { useMinaAppkit } from "mina-appkit";

function App() {
  // Automatically attempt to connect on component mount
  const { address, isConnected, networkID } = useMinaAppkit({
    autoConnect: true,
  });

  return (
    <div>
      <h1>My Mina DApp</h1>
      {isConnected && (
        <div>
          <p>Address: {address}</p>
          <p>Network: {networkID}</p>
        </div>
      )}
    </div>
  );
}
```

### Using Address Utilities

```tsx
import React from "react";
import { useMinaAppkit, formatAddress, validateMinaAddress } from "mina-appkit";

function AddressDisplay() {
  const { address, isConnected } = useMinaAppkit();

  if (!isConnected || !address) {
    return <p>No wallet connected</p>;
  }

  // Validate the address (optional, as the hook already provides valid addresses)
  const isValid = validateMinaAddress(address);

  // Format the address for display
  const shortAddress = formatAddress(address);

  return (
    <div>
      <p>Short Address: {shortAddress}</p>
      <p>Full Address: {address}</p>
      <p>Valid: {isValid ? "Yes" : "No"}</p>
    </div>
  );
}
```

## API Reference

### `useMinaAppkit(props)`

The main hook for wallet integration.

#### Parameters

- `props` (optional): Configuration object
  - `autoConnect`: boolean - Whether to automatically attempt connection on mount (default: `false`)

#### Returns

An object containing:

- `address`: `string | undefined` - The connected wallet address
- `isConnected`: `boolean` - Whether a wallet is currently connected
- `networkID`: `string | undefined` - The current network identifier
- `isWalletInstalled`: `boolean` - Whether Auro Wallet is installed
- `triggerWallet`: `() => Promise<string | undefined>` - Function to initiate wallet connection
- `disconnect`: `() => void` - Function to disconnect the wallet

### `formatAddress(address: string)`

Formats a Mina address to a shorter, display-friendly format.

#### Parameters

- `address`: `string` - The full Mina address to format

#### Returns

- `string` - Formatted address in the format "B62q12...ab34"

#### Example

```tsx
const formatted = formatAddress(
  "B62qjVL9RjmmaD4yh9V3fGFkJ5VDWkjAkqF3W3F7t8FU2jTT6wxPZ9s"
);
// Returns: "B62qjV...Z9s"
```

### `validateMinaAddress(address: string)`

Validates whether a string is a valid Mina address.

#### Parameters

- `address`: `string` - The address to validate

#### Returns

- `boolean` - `true` if the address is valid, `false` otherwise

#### Validation Rules

A valid Mina address must:

- Start with "B62q"
- Be exactly 55 characters long
- Contain only valid base58 characters
- Not be null or undefined

### Supported Networks

The library supports the following networks:

```tsx
enum NetworkID {
  MINA_MAINNET = "mina:mainnet",
  MINA_DEVNET = "mina:devnet",
  ZEKO_TESTNET = "zeko:testnet",
}
```

## State Management

The library uses Zustand for state management with localStorage persistence. The connection state is automatically saved and restored between browser sessions.

### Persisted Data

The following data is persisted:

- Wallet connection status
- Connected address
- Network ID

### State Validation

The library automatically validates the stored connection state against the current wallet state to ensure consistency.

## Error Handling

The library includes comprehensive error handling:

- Wallet not installed detection
- Connection failures
- Network request failures
- Address validation errors

All errors are logged to the console with the prefix `[Mina Appkit]` for easy debugging.

## Browser Compatibility

This library works in all modern browsers

## TypeScript Support

The library is written in TypeScript and provides full type definitions.

## Contributing

This is an independent, community-driven project. Contributions are welcome! Please feel free to submit issues and pull requests.

## License

MIT License - see the LICENSE file for details.

Use this library at your own discretion. Always verify and test thoroughly before using in production applications.

## Support

For issues, questions, or contributions, feel free to reach out to me on [Twitter](https://x.com/NeoGar_real).
