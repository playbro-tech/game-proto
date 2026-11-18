# Gift-mode messages

Human translation: [Русский](../ru/gift-mode.md).

The package exports `GiftModeRequestSchema`, `GiftModeResponseSchema` and
`CommandType.gift_mode`. They model explicit gift-mode selection separately from
the `play` command that executes a round. These schemas support local integration
and mocks; they do not establish deployment or acceptance by a particular server.

## Request and confirmation

The request uses `command`, `session_id`, `sign_key` and `paused`. JSON examples
use proto names; see [serialization](serialization.md) for conversion options:

```json
{
  "command": "gift_mode",
  "session_id": "test-session",
  "sign_key": "test-sign",
  "paused": false
}
```

`paused: false` selects gifts; `paused: true` selects balance play. Both are
explicit mode intents. Neither request contains a spin action. Request IDs,
command correlation and error status are transport-envelope responsibilities,
as with the package's other base request/response messages.

Successful confirmation carries the offer at the root:

```json
{
  "gift_spin": {
    "bet": "10",
    "left": 7,
    "total": 10,
    "total_bet": "30",
    "total_win": "120",
    "status": "started",
    "paused": false
  }
}
```

The schemas use protobuf JSON int64 strings for stake and win fields; generated
TypeScript messages use `bigint`. Wire applications can apply their existing
transport numeric conventions separately.

## Presence, containers and lifecycle

`GiftModeRequest.paused` and `GiftSpin.paused` have explicit presence. An absent
value is `undefined` in generated TypeScript, while an explicit `false` remains
present when serialized with protobuf's default JSON options. A caller must
validate that a request supplies its intent and that a successful confirmation
supplies the expected offer and mode. Parsing a protobuf message alone does not
perform those business checks. Missing or null offer data does not mean an
existing unpaused offer.

The same `GiftSpin` schema appears in these containers:

| Response | Offer location |
| --- | --- |
| `GiftModeResponse`, `LoginResponse`, `SyncResponse` | `gift_spin` |
| `StartResponse`, `PlayResponse` | `context.gift_spin` |

Offer lifecycle and selected mode remain independent. The string `status` can
carry `new`, `started`, `finished`, `deleted` or a legacy/integration-specific
value. A terminal offer can retain final counters and win; the schema does not
clear them or determine settlement. Zero remaining gifts alone does not finish
an associated bonus. `is_previous_gift` remains at its existing field number for
legacy/debug data and is deprecated; clients use confirmed `paused` for mode.
The package retains `StartRequest.mode` for wire compatibility and performs no
automatic fallback from a failed `gift_mode` request.

## Generation and verification

The `.proto` files own the contract. [Development](development.md) owns generation
and check commands. The wire tests cover presence, response containers, terminal
data and invalid values; they do not verify UI/FSM coordination, mock-server
behavior or a live deployment. See the [base API](base-api.md) for surrounding
session commands and the [schema reference](schema-reference.md) for exact fields.
