# On-chain Registry dApp

This project contains a small full-stack dApp for publishing immutable text records:

- `contracts/OnChainRegistry.sol` stores a name, message, owner, and timestamp.
- Hardhat runs the local Ethereum node and deploys the contract.
- `server.js` is an Express API that reads records and signs write transactions with a local test account.
- `public/` is a dependency-free HTML/CSS/JavaScript frontend.

## Run locally

From `17 june`:

```sh
npm install
copy .env.example .env
npm run compile
```

In a second terminal, start the local node and copy one of its private keys into `.env`:

```sh
npm run node
npm run deploy
npm start
```

Open <http://localhost:4444>. The API is available at `/api/records` and `/api/health`.
