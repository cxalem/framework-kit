# @solana/server-client

Opinionated server-side Solana client built on top of `@solana/client`. Works in Node.js and Bun, adds default
cluster resolution, and ships signer ergonomics (load from files/env/base58, generate, and persist).

> **Status:** Early draft – API may evolve as we wire more recipes in.

## Install

```bash
pnpm add @solana/server-client
```

## Quick start

Create a server-ready client with a moniker (or custom endpoint) and use the existing helpers from `@solana/client`.

```ts
import { createServerClient, loadKeypairFromFile } from '@solana/server-client';

const authority = await loadKeypairFromFile('~/.config/solana/id.json');
const client = createServerClient({ moniker: 'devnet', commitment: 'confirmed' });

const signature = await client.helpers.transaction.prepareAndSend({
	authority: authority.signer,
	instructions: [
		{
			accounts: [],
			data: new Uint8Array(),
			programAddress: '11111111111111111111111111111111',
		},
	],
});

console.log('tx', signature);
```

## Signer ergonomics

- `generateKeypair()` – random 32-byte seed → signer + 64-byte secret key for persistence.
- `loadKeypairFromFile(path)` – accepts CLI-style JSON arrays or base58 strings.
- `loadKeypairFromEnv(VAR)` – parse base58 or JSON in environment variables.
- `saveKeypairToFile(path, { keypair })` / `saveKeypairToEnvFile(path, VAR, { keypair })` – write JSON (default) or
  base58 with `0600` permissions.

All helpers default to `extractable` keys so you can export to base58/JSON for later reuse.

## Cluster helpers

Pass a moniker instead of wiring URLs manually:

```ts
const client = createServerClient({ moniker: 'mainnet' });
// uses https://api.mainnet-beta.solana.com and wss://api.mainnet-beta.solana.com
```

Monikers: `devnet` (default), `mainnet`/`mainnet-beta`, `testnet`, `localnet`/`localhost`. Custom endpoints still work.

## Roadmap

- Bundle opinionated transaction recipes (token create/mint/transfer, stake operations).
- Add first-party RPC monitors/logging suitable for server runtimes.
- Tighten Bun coverage in CI once the surface stabilizes.
