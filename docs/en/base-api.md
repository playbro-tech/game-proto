# Base session API

Human translation: [Русский](../ru/base-api.md).

`api.base.v1` defines request/response bodies for session commands. It declares
no service, route, HTTP method, WebSocket framing, request ID, response status or
error message. The transport must define those separately. The
[GameService](game-service.md) HTTP annotations do not assign endpoints to these
messages.

## Commands and bodies

| `CommandType` | Number | Request → response | Purpose |
| --- | --- | --- | --- |
| `COMMAND_TYPE_UNKNOWN_UNSPECIFIED` | 0 | — | Unspecified command |
| `sync` | 1 | `SyncRequest` → `SyncResponse` | Refresh user and offer |
| `login` | 2 | `LoginRequest` → `LoginResponse` | Authenticate and obtain signing data |
| `start` | 3 | `StartRequest` → `StartResponse` | Obtain context and settings |
| `play` | 4 | `PlayRequest` → `PlayResponse` | Execute an action |
| `ready` | 5 | No dedicated message pair | Enum value only |
| `gift_mode` | 6 | `GiftModeRequest` → `GiftModeResponse` | Select gift/balance mode |

The schema does not enforce the command value inside a particular request.
Do not invent a `ReadyRequest`, error DTO or successful server behavior from an
enum value. Field numbers and exact types are in the
[schema reference](schema-reference.md).

## Login and start

`LoginRequest` contains `command`, `game_name`, `token` and `language`.
`LoginResponse` contains `user`, `sign_key` and `gift_spin`. The response has no
`session_id` field: how the client obtains a session ID belongs to the transport
integration. Keep signing material private; the schema defines no signing algorithm.

`StartRequest` contains `command`, `game_name`, `session_id`, `sign_key` and an
optional string `mode`. `StartResponse` contains `user`, `context` and `settings`.
The schema does not constrain `mode` to an enum or establish that it switches
gift funding. Explicit gift selection belongs to [gift mode](gift-mode.md).

The typical application flow is login, start, then actions allowed by context;
the schema itself contains no state machine or required request ordering.
Use the confirmed context to restore a session rather than inferring a new round
from the presence of a bonus or promotional offer.

## Play and actions

`PlayRequest` contains `command`, `action`, `session_id`, `sign_key`, the boolean
`gift_spin`, the boolean `quick_spin` and the `int32` `set_denominator`.
`PlayResponse` contains `user` and `context`.

`Action` has a string `name` and an `ActionParams` message. All six parameters
have explicit presence:

| Parameter | Type | Role |
| --- | --- | --- |
| `bet_per_line` | optional int32 | Per-line wager parameter |
| `lines` | optional int32 | Selected line count |
| `feature_id` | optional int32 | Game-defined feature selection |
| `user_choose` | optional int32 | Game-defined purchase choice |
| `ante_bet` | optional string | Ante selection in the integration's format |
| `cheat` | optional string | Integration-specific debug instruction |

The package does not enumerate action names or feature IDs. Available next action
names are carried in `Context.actions`; meanings and authorization belong to
the game/backend. `gift_spin` describes a requested round, while a confirmed
offer's `paused` describes selected mode. Neither property proves how a server
funded an accepted round. The package performs no balance debit, settlement or
retry. In particular, it supplies no idempotency guarantee for resending `play`.

Example body in protobuf JSON with proto names:

```json
{
  "command": "play",
  "session_id": "example-session",
  "sign_key": "example-sign",
  "action": { "name": "spin", "params": { "bet_per_line": 10, "lines": 20 } }
}
```

Omitted implicit booleans decode as `false`; omitted `set_denominator` decodes
as zero. Their meaning for a backend must be verified in that integration.
An illustrative body does not establish an accepted wager.

## Sync and response application

`SyncRequest` contains `command`, `session_id` and `sign_key`.
`SyncResponse` contains `user` and root-level `gift_spin`. It has no full
`context` or `settings`, so it is not interchangeable with `StartResponse`.

The offer is at the root in login/sync/gift-mode responses and in `context` in
start/play responses. Use the schema for the actual response family.
Apply server-confirmed amounts and state under the consumer's request-correlation
and lifecycle rules. Parsing alone does not validate that a response is current,
successful, complete or associated with the intended request. Error codes,
session expiration and recovery are not specified by these messages.
