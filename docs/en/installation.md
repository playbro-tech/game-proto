# Installation and first use

Human translation: [Русский](../ru/installation.md).

## Consumer dependency

Install the package from the registry configured for your environment and install
its peer runtime `@bufbuild/protobuf` matching `^2.11.0`:

```bash
pnpm add @playbro-tech/game-proto @bufbuild/protobuf@^2.11.0
```

Registry authentication belongs to the consuming environment. A source checkout
beside an application does not change its installed dependency. Use the manifest,
lockfile and installed declarations to identify the actual contract. The source
manifest uses pnpm `10.12.1` for package development; the application keeps its
own package-manager policy.

The distributable contains `dist/`, an ESM entry `dist/index.js` and declarations
`dist/index.d.ts`. Import public symbols from the package root. Do not depend on
ignored `src/` files or undocumented deep paths. There is no CommonJS build.
The build targets ES2022; use an environment with ESM and `bigint` support.

## Construct a message

```ts
import { create, fromBinary, toBinary, toJson } from '@bufbuild/protobuf';
import { CommandType, PlayRequestSchema } from '@playbro-tech/game-proto';
import type { PlayRequest } from '@playbro-tech/game-proto';

const request: PlayRequest = create(PlayRequestSchema, {
  command: CommandType.play,
  sessionId: 'example-session',
  signKey: 'example-sign',
  action: { name: 'spin', params: { betPerLine: 10, lines: 20 } },
});

const json = toJson(PlayRequestSchema, request, { useProtoFieldName: true });
const binary = toBinary(PlayRequestSchema, request);
const restored = fromBinary(PlayRequestSchema, binary);
```

The values are illustrative, not valid credentials or an instruction to send a
round. `json`, `binary` and `restored` show local serialization only. The schema
does not validate that `spin`, the wager or the session is accepted by a server.

Each message exports a TypeScript type and a `<MessageName>Schema` descriptor.
Enums export runtime values and descriptors such as `CommandTypeSchema`.
`GameService` is a descriptor, not an instantiated network client. The
[schema reference](schema-reference.md) lists the project-owned exports.

Read [serialization](serialization.md) before connecting a transport and select
the [base API](base-api.md) or [GameService](game-service.md) contract used by it.
