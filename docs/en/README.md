# game-proto

Human translation: [Русский](../ru/README.md).

`@playbro-tech/game-proto` defines protobuf messages, enums and a service descriptor
for game integrations. It builds an ESM library with TypeScript declarations and
generates an OpenAPI description from annotated RPC methods. The package manifest
declares version `0.6.0`; this reference describes the checked-out source, which
can include changes beyond a published artifact. Verify the installed descriptors
before relying on a field in a released dependency.

## Boundaries

The package supplies schemas and generated exports. The consuming application
supplies networking, authentication, request correlation, retries, error envelopes,
business validation and game lifecycle. No HTTP/WebSocket client, game mathematics,
UI, FSM, mock server or automatic round execution is implemented here.

There are two API families. `api.base.v1` models session commands using
`common.v1` and `domain.v1` state. `api.game.v1` is used by the annotated
`services.v1.GameService` and returns `base.v1.Step` sequences. Neither family
implicitly replaces or converts the other.

## Documentation

- [Installation](installation.md): peer runtime, imports and a first message.
- [Serialization](serialization.md): TypeScript, protobuf JSON, binary, presence and oneof.
- [Base API](base-api.md): login, start, play, sync and command boundaries.
- [GameService](game-service.md): init/command RPCs and step payloads.
- [Data models](models.md): settings, rounds, wins, cascades and feature state.
- [Schema reference](schema-reference.md): every project message, field number, type and enum value.
- [Gift-mode messages](gift-mode.md): explicit intent, confirmations and offer lifecycle.
- [Development](development.md): source layout, generation, checks, OpenAPI and compatibility.

## Repository layout and commands

`proto/` owns the protocol. `plugins/` contains the entry-point and OpenAPI
generators. `tests/` contains wire-contract tests. `docs/en/` and `docs/ru/`
contain matching human documentation. Generated `src/`, `dynamic/` and `dist/`
are ignored outputs; `docs/openapi.yaml` is a separate tracked document and is
not the input selected by Redocly.

Source work uses pnpm `10.12.1` and installed development dependencies.
`pnpm proto:generate` generates messages and OpenAPI; `pnpm test` checks the
gift-mode wire contract and Buf lint; `pnpm build` builds the distributable;
`pnpm docs:build` renders the generated OpenAPI with Redocly. The ordered
procedure and prerequisites belong to [development](development.md).
