# Session and game-state models

Human translation: [Русский](../ru/models.md).

This page explains `common.v1` and `domain.v1` used by the [base API](base-api.md).
Exact fields, scalar types, presence and tags belong to the
[schema reference](schema-reference.md); representation belongs to
[serialization](serialization.md). The separate `base.v1` step model is described
with [GameService](game-service.md).

## User and settings

`User` contains `int64 balance`, `currency_code` and `currency`. Balance is in
the smallest currency unit described by the integration. Currency codes can be
ISO 4217 codes or virtual currency codes.

`Settings` contains `bet_per_spin`, `bet_factor`, `bets`, `currency_format`,
`paytable`, optional `buy_freespin`, `buy_features` and `collector_vault` states.
Bet amounts/factors use 64-bit integer fields. `paytable` is an open
`google.protobuf.Struct`; the schema does not constrain its internal keys.

`CurrencyFormat.currency_style` and `.style` are strings, even though separate
`CurrencyType` and `CurrencyStyle` enums also exist. Typical documented strings
are `symbol`, `code`, `hidden` or empty for `currency_style`, and `money`, `fun`,
`crypto` for `style`. `bet_multiplier_exponent` is an integer parameter, not an
implemented formatter or scaling function.

`BuyFreespin` carries availability and a bet multiplier. `BuyFeature` carries an
ID, `int32 price`, optional name and optional `Params.choice` (`int64[]`).
`SymbolPayoutData` wraps typed `SymbolPayout` entries (`type`, `double multiplier`,
optional `freespins`, optional string `trigger`); it is exported but does not
replace `Settings.paytable`. `SymbolPayout` has no active `occurrences` field.
Do not assume every amount-like field has the same scalar type.

## Context and rounds

`Context.actions` is a list of available action names; `current` is a string
such as `spins`, `freespins` or `bonus`, not an enum. The context can carry
`gift_spin`, `spins`, `freespins`, optional `buy_feature_data` and `bonus`.
These fields are not a oneof. The parser does not choose the active mode or
clear inactive blocks. The consumer interprets the confirmed context under its
game contract. Offer presence alone does not start play; [gift mode](gift-mode.md)
owns promotional offer semantics.

| Model | Main responsibility |
| --- | --- |
| `Spins` | Round wager/win, line wins, screen, cascades, per-spin/global multipliers, max win, money matrices, collector, random event and events |
| `Freespins` | Round data plus remaining/granted/total spins, accumulated win, events and persistent feature modifiers |
| `Bonus` | Non-freespin bonus mode, round data/counters, money board, collector, three booster slots and additional multipliers |

Round amounts, optional `bet_per_line`, bonus/free-spin counters and total wins
are `int64`. `Freespins.rounds_total` is total **awarded** spins including
retriggers; consuming a spin lowers `rounds_left` without lowering that total.
`Bonus.rounds_total` is documented as bonus spins **played**. The identical field
name does not imply identical counter semantics. Treat confirmed counters as
state, without adding `rounds_granted` to an already updated total a second time.
Finishing animations, pending actions and settlement belong to the game lifecycle.

## Boards, wins and cascades

`OrthogonalPosition` is zero-based: x is the reel/column from the left, y is the
row from the top. `IdList.ids` wraps unsigned symbol IDs; repeated `IdList`
represents a matrix, not a raw `number[][]` message field. `ValueList.values`
is the analogous signed 64-bit amount wrapper. Money-board matrices explicitly
use one entry per reel column; board dimensions and symbol meanings come from
the game contract.

`ScreenResult` contains `reels`, `symbol_win` and `scatters`. Each `WinData`
contains a symbol ID, `int64 amount`, positions and optional line, `Trigger`
and free-spin grant. `Line` describes numbered paylines; `Payouts.values`
belongs to the step API payout maps. These are different from a resolved win.

`Cascade` contains `reels`, `clusters`, unlocked/blocked cells, moved blocked
cells, events and scatters. `moved_blocked_cells` is a list of `Movement`
messages with `from_x`, `from_y`, `to_x`, `to_y`, not arrays of four numbers.
The package serializes cascade order and state; removal/drop timing, payout
aggregation and event presentation belong to the integration.

## Multipliers, events and purchases

`Multipliers` contains flat `SymbolMultiplier` placement, matrix placement and
`total_multiplier` for the spin. A symbol multiplier has a position, `int64`
value and optional `Trigger`. `GlobalMultiplier` carries a feature-level value
and optional trigger. Stacking, reset and application rules are game-defined.

`Trigger` distinguishes `FREESPINS`, `RETRIGGER_FREESPINS`, `MAXWIN` and `BONUS`
from its unspecified zero. `MaxWin` contains `uint32 value` and optional `cut`;
it is distinct from the step API's `MaxWinReached.max_win_value`.

`Event` carries `EventType`, optional `int32 value`, affected coordinates,
optional name/target category and symbol IDs. Its enum includes multiplier
update, boom, selection, line, transition, anticipation and random multiplier.
`FeatureModifier` instead represents a rule retained across a feature, with
string type, optional `int64 value`, target category, symbols and positions.
An event and a persistent modifier are not interchangeable.

`BuyFeatureData` carries optional name/type and unlocked cells.
`BuyFeatureType` identifies no-buy, standard, super and mystery purchase types.
Enum identities do not validate purchase prices, guaranteed scatters, probabilities
or spin counts for every game. Those values belong to the game's settings/rules.

## Hold-and-win data

`MoneyBoard` carries amount and multiplier matrices, new `MoneySymbol` entries,
`round_left` and `total_win`. Zero matrix entries denote empty cells.
`CollectorVault.total_money` is runtime collection progress;
`CollectorVaultState` defines a state ID and inclusive `from`/`to` bounds in settings.

`RandomEvent` carries a triggered action name and involved positions.
`AdditionalMultiplier` carries a completion-rule name, value and positions.
`Booster` carries `BoosterType`, an `int64 value` and `BoosterTarget` cells with
post-booster amounts. Types are boost, spawn and reroll, plus unspecified zero.
`Bonus.booster_a`, `.booster_b` and `.booster_c` are individually optional.
The package does not run activation rolls or calculate collected amounts.
