# Serialization and presence

Human translation: [Русский](../ru/serialization.md).

## Three representations

| Schema | Generated TypeScript | Protobuf JSON |
| --- | --- | --- |
| `snake_case` field | `camelCase` property | lowerCamelCase by default; proto name with `useProtoFieldName: true` |
| `int32`, `uint32`, `double` | `number` | JSON number |
| `int64` | `bigint` | decimal string |
| `bool`, `string` | `boolean`, `string` | boolean, string |
| enum | numeric enum value | declared enum name by default |
| repeated field | array | array, omitted when empty by default |
| map | object with string keys | JSON object |
| message field | message or `undefined` | object, omitted when absent |

Examples in the protocol pages use proto field names. Use `toJson(schema,
message, { useProtoFieldName: true })` to obtain that spelling. `fromJson`
accepts proto names and JSON lowerCamelCase names. Binary encoding uses field
numbers and wire types, not either spelling.

Use `create`, `fromJson`, `toJson`, `fromBinary` and `toBinary` from the protobuf
runtime with the matching descriptor. A plain JSON object is not a generated
message. `JSON.stringify` is not a replacement for `toJson`: message objects can
contain `bigint`, protobuf metadata and a different field layout.

```ts
import { fromJson, toJson } from '@bufbuild/protobuf';
import { GiftSpinSchema } from '@playbro-tech/game-proto';

const offer = fromJson(GiftSpinSchema, {
  total_win: '9007199254740993',
  paused: false,
});
const exactWin = offer.totalWin; // 9007199254740993n
const json = toJson(GiftSpinSchema, offer, { useProtoFieldName: true });
```

Keep 64-bit amounts exact. Converting arbitrary `bigint` values to JavaScript
`number` can lose precision. The package does not provide money formatting or a
global denominator conversion. Field units and the integration contract determine
how to render or scale a value.

## Presence and validation

Proto3 scalar fields without `optional` have implicit defaults: `0`, `0n`, `false`,
`''` or enum zero. An omitted implicit scalar cannot be distinguished from its
default value after decoding. Default JSON output omits those default values.
Repeated fields and maps initialize to empty containers and do not carry presence.

Explicit `optional` scalars retain absence as `undefined`. An explicitly provided
`false`, `0` or empty string remains present, including in default JSON output.
Message fields have presence even without the `optional` keyword; `null` in JSON
does not create a populated message. See [gift mode](gift-mode.md) for the
business importance of an absent `paused` value.

The parser checks protobuf shapes and scalar ranges; it does not enforce that a
login has a token, a play has an action, a command matches its message, positions
fit a board, or a confirmation contains an offer. `fromJson` rejects unknown
JSON fields by default. Use `ignoreUnknownFields: true` only when the integration
deliberately tolerates and discards them. This is a compatibility choice, not
proof that unmodeled server fields are represented by the package.

## Oneof and structured values

`base.v1.Step` uses `oneof payload`. Its TypeScript representation is a
discriminated union, for example:

```ts
import { create } from '@bufbuild/protobuf';
import { StepSchema } from '@playbro-tech/game-proto';

const step = create(StepSchema, {
  payload: { case: 'symbolIds', value: { items: [{ id: 7, position: { x: 0, y: 0 } }] } },
});
```

An unset payload has `case: undefined`. Protobuf JSON places the selected field
directly on the step, such as `{"symbol_ids":{"items":[{"id":7,"position":{}}]}}`
with proto names and default scalar omission. It does not contain a `payload`
wrapper. Consume the selected case instead of looking for four simultaneous
TypeScript properties.

`google.protobuf.Struct` is used for `Settings.paytable` and
`GameCommandRequest.payload`. Protobuf JSON represents it as an ordinary JSON
object; its generated message representation uses the protobuf well-known type.
Use `fromJson` or the runtime's well-known-type helpers rather than assigning an
arbitrary object as an already constructed message. Struct numeric values are
JSON numbers; use a typed integer field for exact 64-bit integer data.
