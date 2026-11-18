# Справочник схем

Канонический источник: [English](../en/schema-reference.md).

Полный перечень дескрипторов проекта из `.proto`: сообщения, wire-номера и типы полей, presence, enum и RPC. Импортированные Google types не включены.

Состав: 62 сообщений, 7 enum, 1 сервис. Для сообщения экспортируются тип и `<Name>Schema`, для enum — значение и `<Name>Schema`; сервис экспортируется под собственным именем.

Колонка «Поле» использует proto-имена, колонка TypeScript — имя свойства или oneof case. `optional` означает явное ключевое слово; `message presence` означает presence сообщения без него; `implicit` — default без различения отсутствия. Oneof-поля находятся в union, а не в отдельных свойствах.

Семантика: [базовый API](base-api.md), [GameService](game-service.md), [модели](models.md), [gift mode](gift-mode.md). Представления: [сериализация](serialization.md). Обновление: [разработка](development.md).

## api.base.v1

### GiftModeRequest

`api.base.v1.GiftModeRequest` · `proto/api/base/v1/gift_mode_request.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `command` | `command` | `common.v1.CommandType` | implicit |
| 2 | `session_id` | `sessionId` | `string` | implicit |
| 3 | `sign_key` | `signKey` | `string` | implicit |
| 4 | `paused` | `paused` | `bool` | optional |

### GiftModeResponse

`api.base.v1.GiftModeResponse` · `proto/api/base/v1/gift_mode_response.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `gift_spin` | `giftSpin` | `common.v1.GiftSpin` | message presence |

### LoginRequest

`api.base.v1.LoginRequest` · `proto/api/base/v1/login_request.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `command` | `command` | `common.v1.CommandType` | implicit |
| 2 | `game_name` | `gameName` | `string` | implicit |
| 3 | `token` | `token` | `string` | implicit |
| 4 | `language` | `language` | `string` | implicit |

### LoginResponse

`api.base.v1.LoginResponse` · `proto/api/base/v1/login_response.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `user` | `user` | `common.v1.User` | message presence |
| 2 | `sign_key` | `signKey` | `string` | implicit |
| 3 | `gift_spin` | `giftSpin` | `common.v1.GiftSpin` | message presence |

### PlayRequest

`api.base.v1.PlayRequest` · `proto/api/base/v1/play_request.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `command` | `command` | `common.v1.CommandType` | implicit |
| 2 | `action` | `action` | `common.v1.Action` | message presence |
| 3 | `session_id` | `sessionId` | `string` | implicit |
| 4 | `sign_key` | `signKey` | `string` | implicit |
| 5 | `gift_spin` | `giftSpin` | `bool` | implicit |
| 6 | `quick_spin` | `quickSpin` | `bool` | implicit |
| 7 | `set_denominator` | `setDenominator` | `int32` | implicit |

### PlayResponse

`api.base.v1.PlayResponse` · `proto/api/base/v1/play_response.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `user` | `user` | `common.v1.User` | message presence |
| 2 | `context` | `context` | `domain.v1.Context` | message presence |

### StartRequest

`api.base.v1.StartRequest` · `proto/api/base/v1/start_request.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `command` | `command` | `common.v1.CommandType` | implicit |
| 2 | `game_name` | `gameName` | `string` | implicit |
| 3 | `session_id` | `sessionId` | `string` | implicit |
| 4 | `sign_key` | `signKey` | `string` | implicit |
| 5 | `mode` | `mode` | `string` | optional |

### StartResponse

`api.base.v1.StartResponse` · `proto/api/base/v1/start_response.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `user` | `user` | `common.v1.User` | message presence |
| 2 | `context` | `context` | `domain.v1.Context` | message presence |
| 3 | `settings` | `settings` | `domain.v1.Settings` | message presence |

### SyncRequest

`api.base.v1.SyncRequest` · `proto/api/base/v1/sync_request.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `command` | `command` | `common.v1.CommandType` | implicit |
| 2 | `session_id` | `sessionId` | `string` | implicit |
| 3 | `sign_key` | `signKey` | `string` | implicit |

### SyncResponse

`api.base.v1.SyncResponse` · `proto/api/base/v1/sync_response.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `user` | `user` | `common.v1.User` | message presence |
| 2 | `gift_spin` | `giftSpin` | `common.v1.GiftSpin` | message presence |

## api.game.v1

### GameCommandRequest

`api.game.v1.GameCommandRequest` · `proto/api/game/v1/game_command.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `command` | `command` | `string` | implicit |
| 2 | `payload` | `payload` | `google.protobuf.Struct` | message presence |

### GameCommandResponse

`api.game.v1.GameCommandResponse` · `proto/api/game/v1/game_command.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `balance` | `balance` | `uint32` | implicit |
| 2 | `steps` | `steps` | `repeated base.v1.Step` | container |

### GameInitRequest

`api.game.v1.GameInitRequest` · `proto/api/game/v1/game_init.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `game_name` | `gameName` | `string` | implicit |

### GameInitResponse

`api.game.v1.GameInitResponse` · `proto/api/game/v1/game_init.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `balance` | `balance` | `int32` | implicit |
| 2 | `currency_code` | `currencyCode` | `string` | implicit |
| 3 | `bets` | `bets` | `repeated int32` | container |
| 4 | `lines` | `lines` | `repeated common.v1.Line` | container |
| 5 | `symbol_payouts` | `symbolPayouts` | `map<int32, common.v1.Payouts>` | container |
| 6 | `scatter_payouts` | `scatterPayouts` | `map<int32, common.v1.Payouts>` | container |
| 7 | `steps` | `steps` | `repeated base.v1.Step` | container |

## base.v1

### MaxWinReached

`base.v1.MaxWinReached` · `proto/base/v1/max_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `max_win_value` | `maxWinValue` | `uint32` | implicit |
| 2 | `cut` | `cut` | `bool` | optional |

### Position

`base.v1.Position` · `proto/base/v1/position.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `x` | `x` | `int32` | implicit |
| 2 | `y` | `y` | `int32` | implicit |

### Step

`base.v1.Step` · `proto/base/v1/step.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `symbol_ids` | `symbolIds` | `base.v1.SymbolIdsStep` | oneof payload |
| 2 | `symbol_wins` | `symbolWins` | `base.v1.SymbolWinsStep` | oneof payload |
| 3 | `symbol_multipliers` | `symbolMultipliers` | `base.v1.SymbolMultipliersStep` | oneof payload |
| 4 | `max_win_reached` | `maxWinReached` | `base.v1.MaxWinReached` | oneof payload |

### SymbolId

`base.v1.SymbolId` · `proto/base/v1/symbol_id.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `id` | `id` | `uint32` | implicit |
| 2 | `position` | `position` | `base.v1.Position` | message presence |

### SymbolIdsStep

`base.v1.SymbolIdsStep` · `proto/base/v1/step.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `items` | `items` | `repeated base.v1.SymbolId` | container |

### SymbolMult

`base.v1.SymbolMult` · `proto/base/v1/symbol_multiplier.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `multiplier` | `multiplier` | `uint32` | implicit |
| 2 | `position` | `position` | `base.v1.Position` | message presence |

### SymbolMultipliersStep

`base.v1.SymbolMultipliersStep` · `proto/base/v1/step.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `items` | `items` | `repeated base.v1.SymbolMult` | container |

### SymbolWin

`base.v1.SymbolWin` · `proto/base/v1/symbol_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `win` | `win` | `uint32` | implicit |
| 2 | `positions` | `positions` | `repeated base.v1.Position` | container |

### SymbolWinsStep

`base.v1.SymbolWinsStep` · `proto/base/v1/step.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `items` | `items` | `repeated base.v1.SymbolWin` | container |

## common.v1

### Action

`common.v1.Action` · `proto/common/v1/action.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `name` | `name` | `string` | implicit |
| 2 | `params` | `params` | `common.v1.ActionParams` | message presence |

### ActionParams

`common.v1.ActionParams` · `proto/common/v1/action.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `bet_per_line` | `betPerLine` | `int32` | optional |
| 2 | `lines` | `lines` | `int32` | optional |
| 3 | `feature_id` | `featureId` | `int32` | optional |
| 4 | `user_choose` | `userChoose` | `int32` | optional |
| 5 | `ante_bet` | `anteBet` | `string` | optional |
| 6 | `cheat` | `cheat` | `string` | optional |

### BuyFeature

`common.v1.BuyFeature` · `proto/common/v1/buy_feature.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `id` | `id` | `int32` | implicit |
| 2 | `price` | `price` | `int32` | implicit |
| 3 | `name` | `name` | `string` | optional |
| 4 | `params` | `params` | `common.v1.Params` | optional |

### BuyFreespin

`common.v1.BuyFreespin` · `proto/common/v1/buy_freespin.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `active` | `active` | `bool` | implicit |
| 2 | `bet_multiplier` | `betMultiplier` | `int64` | implicit |

### CommandType

`common.v1.CommandType` · `proto/common/v1/command_type.proto`

| Значение | Номер |
| --- | --- |
| `COMMAND_TYPE_UNKNOWN_UNSPECIFIED` | 0 |
| `sync` | 1 |
| `login` | 2 |
| `start` | 3 |
| `play` | 4 |
| `ready` | 5 |
| `gift_mode` | 6 |

### CurrencyFormat

`common.v1.CurrencyFormat` · `proto/common/v1/currency.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `currency_style` | `currencyStyle` | `string` | implicit |
| 2 | `style` | `style` | `string` | implicit |
| 3 | `bet_multiplier_exponent` | `betMultiplierExponent` | `int32` | implicit |

### CurrencyStyle

`common.v1.CurrencyStyle` · `proto/common/v1/currency.proto`

| Значение | Номер |
| --- | --- |
| `CURRENCY_STYLE_UNKNOWN_UNSPECIFIED` | 0 |
| `CURRENCY_STYLE_MONEY` | 1 |
| `CURRENCY_STYLE_FUN` | 2 |
| `CURRENCY_STYLE_CRYPTO` | 3 |

### CurrencyType

`common.v1.CurrencyType` · `proto/common/v1/currency.proto`

| Значение | Номер |
| --- | --- |
| `CURRENCY_TYPE_UNKNOWN_UNSPECIFIED` | 0 |
| `CURRENCY_TYPE_SYMBOL` | 1 |
| `CURRENCY_TYPE_CODE` | 2 |
| `CURRENCY_TYPE_HIDDEN` | 3 |

### Event

`common.v1.Event` · `proto/common/v1/event.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `type` | `type` | `common.v1.EventType` | implicit |
| 2 | `value` | `value` | `int32` | optional |
| 3 | `unlocked_cells` | `unlockedCells` | `repeated common.v1.OrthogonalPosition` | container |
| 4 | `updated_positions` | `updatedPositions` | `repeated common.v1.OrthogonalPosition` | container |
| 5 | `name` | `name` | `string` | optional |
| 6 | `target_type` | `targetType` | `string` | optional |
| 7 | `symbols` | `symbols` | `repeated uint32` | container |

### EventType

`common.v1.EventType` · `proto/common/v1/event.proto`

| Значение | Номер |
| --- | --- |
| `EVENT_TYPE_UNKNOWN_UNSPECIFIED` | 0 |
| `EVENT_TYPE_GLOBAL_MULTIPLIER_UPDATE` | 1 |
| `EVENT_TYPE_BOOM` | 2 |
| `EVENT_TYPE_SELECTION` | 3 |
| `EVENT_TYPE_LINE` | 4 |
| `EVENT_TYPE_TRANSITION` | 5 |
| `EVENT_TYPE_ANTICIPATION` | 6 |
| `EVENT_TYPE_RANDOM_MULTIPLIER` | 7 |

### FeatureModifier

`common.v1.FeatureModifier` · `proto/common/v1/feature_modifier.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `type` | `type` | `string` | implicit |
| 2 | `value` | `value` | `int64` | optional |
| 3 | `target_type` | `targetType` | `string` | optional |
| 4 | `symbols` | `symbols` | `repeated uint32` | container |
| 5 | `positions` | `positions` | `repeated common.v1.OrthogonalPosition` | container |

### GiftSpin

`common.v1.GiftSpin` · `proto/common/v1/gift_spin.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `bet` | `bet` | `int64` | implicit |
| 2 | `total_bet` | `totalBet` | `int64` | implicit |
| 3 | `total_win` | `totalWin` | `int64` | implicit |
| 4 | `left` | `left` | `int32` | implicit |
| 5 | `total` | `total` | `int32` | implicit |
| 6 | `status` | `status` | `string` | implicit |
| 7 | `is_previous_gift` | `isPreviousGift` | `bool` | implicit; deprecated |
| 8 | `paused` | `paused` | `bool` | optional |

### GlobalMultiplier

`common.v1.GlobalMultiplier` · `proto/common/v1/multiplier.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `value` | `value` | `int64` | implicit |
| 2 | `trigger` | `trigger` | `common.v1.Trigger` | optional |

### IdList

`common.v1.IdList` · `proto/common/v1/id_list.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `ids` | `ids` | `repeated uint32` | container |

### Line

`common.v1.Line` · `proto/common/v1/line.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `number` | `number` | `int32` | implicit |
| 2 | `positions` | `positions` | `repeated common.v1.OrthogonalPosition` | container |

### MaxWin

`common.v1.MaxWin` · `proto/common/v1/max_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `value` | `value` | `uint32` | implicit |
| 2 | `cut` | `cut` | `bool` | optional |

### Movement

`common.v1.Movement` · `proto/common/v1/movement.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `from_x` | `fromX` | `int32` | implicit |
| 2 | `from_y` | `fromY` | `int32` | implicit |
| 3 | `to_x` | `toX` | `int32` | implicit |
| 4 | `to_y` | `toY` | `int32` | implicit |

### Multipliers

`common.v1.Multipliers` · `proto/common/v1/multiplier.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `placement` | `placement` | `repeated common.v1.SymbolMultiplier` | container |
| 2 | `matrix_placement` | `matrixPlacement` | `repeated common.v1.IdList` | container |
| 3 | `total_multiplier` | `totalMultiplier` | `int64` | implicit |

### OrthogonalPosition

`common.v1.OrthogonalPosition` · `proto/common/v1/orthogonal_position.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `x` | `x` | `int32` | implicit |
| 2 | `y` | `y` | `int32` | implicit |

### Params

`common.v1.Params` · `proto/common/v1/buy_feature.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `choice` | `choice` | `repeated int64` | container |

### Payouts

`common.v1.Payouts` · `proto/common/v1/payouts.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `values` | `values` | `repeated int32` | container |

### SymbolMultiplier

`common.v1.SymbolMultiplier` · `proto/common/v1/multiplier.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `position` | `position` | `common.v1.OrthogonalPosition` | message presence |
| 2 | `value` | `value` | `int64` | implicit |
| 3 | `trigger` | `trigger` | `common.v1.Trigger` | optional |

### SymbolPayout

`common.v1.SymbolPayout` · `proto/common/v1/symbol_payout.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `type` | `type` | `string` | implicit |
| 2 | `multiplier` | `multiplier` | `double` | implicit |
| 4 | `freespins` | `freespins` | `int32` | optional |
| 5 | `trigger` | `trigger` | `string` | optional |

### Trigger

`common.v1.Trigger` · `proto/common/v1/trigger.proto`

| Значение | Номер |
| --- | --- |
| `UNKNOWN_UNSPECIFIED` | 0 |
| `FREESPINS` | 1 |
| `RETRIGGER_FREESPINS` | 2 |
| `MAXWIN` | 3 |
| `BONUS` | 4 |

### User

`common.v1.User` · `proto/common/v1/user.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `balance` | `balance` | `int64` | implicit |
| 2 | `currency_code` | `currencyCode` | `string` | implicit |
| 3 | `currency` | `currency` | `string` | implicit |

### ValueList

`common.v1.ValueList` · `proto/common/v1/value_list.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `values` | `values` | `repeated int64` | container |

### WinData

`common.v1.WinData` · `proto/common/v1/windata.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `symbol` | `symbol` | `uint32` | implicit |
| 2 | `amount` | `amount` | `int64` | implicit |
| 3 | `positions` | `positions` | `repeated common.v1.OrthogonalPosition` | container |
| 4 | `line` | `line` | `int32` | optional |
| 5 | `trigger` | `trigger` | `common.v1.Trigger` | optional |
| 6 | `freespins` | `freespins` | `int32` | optional |

## domain.v1

### AdditionalMultiplier

`domain.v1.AdditionalMultiplier` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `trigger` | `trigger` | `string` | implicit |
| 2 | `value` | `value` | `int64` | implicit |
| 3 | `positions` | `positions` | `repeated common.v1.OrthogonalPosition` | container |

### Bonus

`domain.v1.Bonus` · `proto/domain/v1/bonus.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `mode` | `mode` | `string` | optional |
| 2 | `round_bet` | `roundBet` | `int64` | implicit |
| 3 | `round_win` | `roundWin` | `int64` | implicit |
| 4 | `screen_result` | `screenResult` | `domain.v1.ScreenResult` | optional |
| 5 | `multipliers` | `multipliers` | `common.v1.Multipliers` | optional |
| 6 | `global_multiplier` | `globalMultiplier` | `common.v1.GlobalMultiplier` | optional |
| 7 | `bet_per_line` | `betPerLine` | `int64` | optional |
| 8 | `rounds_left` | `roundsLeft` | `int64` | implicit |
| 9 | `rounds_granted` | `roundsGranted` | `int64` | implicit |
| 10 | `rounds_total` | `roundsTotal` | `int64` | implicit |
| 11 | `total_win` | `totalWin` | `int64` | implicit |
| 12 | `max_win` | `maxWin` | `common.v1.MaxWin` | optional |
| 13 | `board` | `board` | `domain.v1.MoneyBoard` | optional |
| 14 | `collector_vault` | `collectorVault` | `domain.v1.CollectorVault` | optional |
| 15 | `booster_a` | `boosterA` | `domain.v1.Booster` | optional |
| 16 | `booster_b` | `boosterB` | `domain.v1.Booster` | optional |
| 17 | `booster_c` | `boosterC` | `domain.v1.Booster` | optional |
| 18 | `additional_multipliers` | `additionalMultipliers` | `repeated domain.v1.AdditionalMultiplier` | container |

### Booster

`domain.v1.Booster` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `type` | `type` | `domain.v1.BoosterType` | implicit |
| 2 | `value` | `value` | `int64` | implicit |
| 3 | `targets` | `targets` | `repeated domain.v1.BoosterTarget` | container |

### BoosterTarget

`domain.v1.BoosterTarget` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `position` | `position` | `common.v1.OrthogonalPosition` | message presence |
| 2 | `value` | `value` | `int64` | implicit |

### BoosterType

`domain.v1.BoosterType` · `proto/domain/v1/hold_and_win.proto`

| Значение | Номер |
| --- | --- |
| `BOOSTER_TYPE_UNKNOWN_UNSPECIFIED` | 0 |
| `BOOSTER_TYPE_BOOST` | 1 |
| `BOOSTER_TYPE_SPAWN` | 2 |
| `BOOSTER_TYPE_REROLL` | 3 |

### BuyFeatureData

`domain.v1.BuyFeatureData` · `proto/domain/v1/buy_feature.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `name` | `name` | `string` | optional |
| 2 | `unlocked_cells` | `unlockedCells` | `repeated common.v1.OrthogonalPosition` | container |
| 3 | `type` | `type` | `domain.v1.BuyFeatureType` | optional |

### BuyFeatureType

`domain.v1.BuyFeatureType` · `proto/domain/v1/buy_feature.proto`

| Значение | Номер |
| --- | --- |
| `BUY_FEATURE_TYPE_NO_BUY_UNSPECIFIED` | 0 |
| `BUY_FEATURE_TYPE_STANDARD_BUY` | 1 |
| `BUY_FEATURE_TYPE_SUPER_BUY` | 2 |
| `BUY_FEATURE_TYPE_MYSTERY_BUY` | 3 |

### Cascade

`domain.v1.Cascade` · `proto/domain/v1/cascade.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `reels` | `reels` | `repeated common.v1.IdList` | container |
| 2 | `clusters` | `clusters` | `repeated common.v1.WinData` | container |
| 3 | `unlocked_cells` | `unlockedCells` | `repeated common.v1.OrthogonalPosition` | container |
| 4 | `blocked_cells` | `blockedCells` | `repeated common.v1.OrthogonalPosition` | container |
| 5 | `moved_blocked_cells` | `movedBlockedCells` | `repeated common.v1.Movement` | container |
| 6 | `events` | `events` | `repeated common.v1.Event` | container |
| 7 | `scatters` | `scatters` | `repeated common.v1.WinData` | container |

### CollectorVault

`domain.v1.CollectorVault` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `total_money` | `totalMoney` | `int64` | implicit |

### CollectorVaultState

`domain.v1.CollectorVaultState` · `proto/domain/v1/collector_vault.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `state` | `state` | `int64` | implicit |
| 2 | `from` | `from` | `int64` | implicit |
| 3 | `to` | `to` | `int64` | implicit |

### Context

`domain.v1.Context` · `proto/domain/v1/context.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `actions` | `actions` | `repeated string` | container |
| 2 | `current` | `current` | `string` | implicit |
| 3 | `gift_spin` | `giftSpin` | `common.v1.GiftSpin` | message presence |
| 4 | `spins` | `spins` | `domain.v1.Spins` | message presence |
| 5 | `freespins` | `freespins` | `domain.v1.Freespins` | message presence |
| 6 | `buy_feature_data` | `buyFeatureData` | `domain.v1.BuyFeatureData` | optional |
| 7 | `bonus` | `bonus` | `domain.v1.Bonus` | message presence |

### Freespins

`domain.v1.Freespins` · `proto/domain/v1/freespins.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `round_bet` | `roundBet` | `int64` | implicit |
| 2 | `round_win` | `roundWin` | `int64` | implicit |
| 3 | `winline` | `winline` | `repeated common.v1.WinData` | container |
| 4 | `cascade` | `cascade` | `repeated domain.v1.Cascade` | container |
| 5 | `multipliers` | `multipliers` | `common.v1.Multipliers` | optional |
| 6 | `global_multiplier` | `globalMultiplier` | `common.v1.GlobalMultiplier` | optional |
| 7 | `bet_per_line` | `betPerLine` | `int64` | optional |
| 8 | `rounds_left` | `roundsLeft` | `int64` | implicit |
| 9 | `rounds_granted` | `roundsGranted` | `int64` | implicit |
| 10 | `rounds_total` | `roundsTotal` | `int64` | implicit |
| 11 | `total_win` | `totalWin` | `int64` | implicit |
| 12 | `events` | `events` | `repeated common.v1.Event` | container |
| 13 | `feature_modifiers` | `featureModifiers` | `repeated common.v1.FeatureModifier` | container |
| 14 | `max_win` | `maxWin` | `common.v1.MaxWin` | optional |
| 15 | `screen_result` | `screenResult` | `domain.v1.ScreenResult` | optional |

### MoneyBoard

`domain.v1.MoneyBoard` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `moneys` | `moneys` | `repeated common.v1.ValueList` | container |
| 2 | `moneys_multipliers` | `moneysMultipliers` | `repeated common.v1.IdList` | container |
| 3 | `new_moneys` | `newMoneys` | `repeated domain.v1.MoneySymbol` | container |
| 4 | `round_left` | `roundLeft` | `int64` | implicit |
| 5 | `total_win` | `totalWin` | `int64` | implicit |

### MoneySymbol

`domain.v1.MoneySymbol` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `position` | `position` | `common.v1.OrthogonalPosition` | message presence |
| 2 | `value` | `value` | `int64` | implicit |

### RandomEvent

`domain.v1.RandomEvent` · `proto/domain/v1/hold_and_win.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `triggered` | `triggered` | `string` | implicit |
| 2 | `positions` | `positions` | `repeated common.v1.OrthogonalPosition` | container |

### ScreenResult

`domain.v1.ScreenResult` · `proto/domain/v1/screen_result.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `reels` | `reels` | `repeated common.v1.IdList` | container |
| 2 | `symbol_win` | `symbolWin` | `repeated common.v1.WinData` | container |
| 3 | `scatters` | `scatters` | `repeated common.v1.WinData` | container |

### Settings

`domain.v1.Settings` · `proto/domain/v1/settings.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `bet_per_spin` | `betPerSpin` | `int64` | implicit |
| 2 | `bet_factor` | `betFactor` | `repeated int64` | container |
| 3 | `bets` | `bets` | `repeated int64` | container |
| 4 | `currency_format` | `currencyFormat` | `common.v1.CurrencyFormat` | message presence |
| 5 | `paytable` | `paytable` | `google.protobuf.Struct` | message presence |
| 6 | `buy_freespin` | `buyFreespin` | `common.v1.BuyFreespin` | optional |
| 7 | `buy_features` | `buyFeatures` | `repeated common.v1.BuyFeature` | container |
| 8 | `collector_vault` | `collectorVault` | `repeated domain.v1.CollectorVaultState` | container |

### Spins

`domain.v1.Spins` · `proto/domain/v1/spins.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `round_bet` | `roundBet` | `int64` | implicit |
| 2 | `round_win` | `roundWin` | `int64` | implicit |
| 3 | `winline` | `winline` | `repeated common.v1.WinData` | container |
| 4 | `screen_result` | `screenResult` | `domain.v1.ScreenResult` | optional |
| 5 | `cascade` | `cascade` | `repeated domain.v1.Cascade` | container |
| 6 | `multipliers` | `multipliers` | `common.v1.Multipliers` | optional |
| 7 | `global_multiplier` | `globalMultiplier` | `common.v1.GlobalMultiplier` | optional |
| 8 | `bet_per_line` | `betPerLine` | `int64` | optional |
| 9 | `max_win` | `maxWin` | `common.v1.MaxWin` | optional |
| 10 | `moneys_values` | `moneysValues` | `repeated common.v1.ValueList` | container |
| 11 | `moneys_multipliers` | `moneysMultipliers` | `repeated common.v1.IdList` | container |
| 12 | `collector_vault` | `collectorVault` | `domain.v1.CollectorVault` | optional |
| 13 | `random_event` | `randomEvent` | `domain.v1.RandomEvent` | optional |
| 14 | `events` | `events` | `repeated common.v1.Event` | container |

### SymbolPayoutData

`domain.v1.SymbolPayoutData` · `proto/domain/v1/settings.proto`

| № | Поле | TypeScript | Proto-тип | Presence |
| --- | --- | --- | --- | --- |
| 1 | `payouts` | `payouts` | `repeated common.v1.SymbolPayout` | container |

## services.v1

### GameService

`services.v1.GameService` · `proto/services/v1/game_service.proto`

| RPC | Запрос | Ответ |
| --- | --- | --- |
| `GameInit` | `api.game.v1.GameInitRequest` | `api.game.v1.GameInitResponse` |
| `GameCommand` | `api.game.v1.GameCommandRequest` | `api.game.v1.GameCommandResponse` |
