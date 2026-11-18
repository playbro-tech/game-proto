# GameService and step API

Human translation: [Русский](../ru/game-service.md).

`services.v1.GameService` declares two unary RPCs with Google HTTP annotations.
The generated `GameService` export describes the service; transport code and a
server implementation are separate dependencies.

| RPC | Annotated POST path | Request | Response |
| --- | --- | --- | --- |
| `GameInit` | `game/init` | `api.game.v1.GameInitRequest` | `api.game.v1.GameInitResponse` |
| `GameCommand` | `game/command` | `api.game.v1.GameCommandRequest` | `api.game.v1.GameCommandResponse` |

Both annotations use `body: "*"`. The OpenAPI generator normalizes the paths to
`/game/init` and `/game/command`. This mapping does not implement an HTTP router
or prove that a deployment accepts either endpoint.

## Init

`GameInitRequest` contains `game_name`. The response contains an `int32`
`balance`, string `currency_code`, repeated `int32` `bets`, repeated `Line`
`lines`, maps `symbol_payouts` and `scatter_payouts` keyed by `int32` symbol ID,
and repeated `Step` `steps`.

Each payout-map value is `common.v1.Payouts` with repeated `int32` `values`.
JSON object keys are strings even when the protobuf map key is an integer.
A `Line` contains a `number` and coordinate `positions`.

## Command

`GameCommandRequest` contains a free-form string `command` and
`google.protobuf.Struct` `payload`. It does not use `CommandType` or
`api.base.v1.Action`. The response contains a `uint32` `balance` and repeated
`Step` `steps`. Note the signed `int32` init balance versus unsigned `uint32`
command balance; neither is the `int64` balance in `common.v1.User`.

Use [protobuf JSON conversion](serialization.md) for a structured payload:

```ts
import { fromJson } from '@bufbuild/protobuf';
import { GameCommandRequestSchema } from '@playbro-tech/game-proto';

const request = fromJson(GameCommandRequestSchema, {
  command: 'example-command',
  payload: { selection: 1 },
});
```

Command names and payload contents are defined by the consuming service. This
example demonstrates construction and does not specify a supported game action.

## Steps

Each `base.v1.Step` has one `payload` oneof:

| Proto branch | TypeScript case | Value |
| --- | --- | --- |
| `symbol_ids` | `symbolIds` | `SymbolIdsStep.items`: `SymbolId` with `uint32 id` and `Position` |
| `symbol_wins` | `symbolWins` | `SymbolWinsStep.items`: `SymbolWin` with `uint32 win` and repeated `Position` |
| `symbol_multipliers` | `symbolMultipliers` | `SymbolMultipliersStep.items`: `SymbolMult` with `uint32 multiplier` and `Position` |
| `max_win_reached` | `maxWinReached` | `MaxWinReached`: `uint32 max_win_value`, optional `bool cut` |

`base.v1.Position` contains `int32 x` and `int32 y`. It is a distinct type from
`common.v1.OrthogonalPosition`, even though both have two coordinates.
Step lists preserve their transmitted order; the schema does not schedule
animations or calculate state transitions. Handle an absent payload in the
consumer rather than assuming every parsed step has a selected branch.

## OpenAPI scope

The generated document describes these annotated methods and only schemas
reachable from their request/response types. It does not list the base session
commands. It declares JSON/protobuf request and success formats, a `200` response,
a description-only `400` response and bearer security from generator configuration.
Those declarations do not define the full operational error or authentication
contract of a deployed server. See [development](development.md) for generation
and its limitations; see the [schema reference](schema-reference.md) for exact tags.
