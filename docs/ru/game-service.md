# GameService и API шагов

Канонический источник: [English](../en/game-service.md).

`services.v1.GameService` объявляет два unary RPC с Google HTTP-аннотациями.
Экспорт `GameService` описывает сервис; транспортный код и реализация сервера
являются отдельными зависимостями.

| RPC | Аннотированный POST-путь | Запрос | Ответ |
| --- | --- | --- | --- |
| `GameInit` | `game/init` | `api.game.v1.GameInitRequest` | `api.game.v1.GameInitResponse` |
| `GameCommand` | `game/command` | `api.game.v1.GameCommandRequest` | `api.game.v1.GameCommandResponse` |

Обе аннотации используют `body: "*"`. Генератор OpenAPI нормализует пути в
`/game/init` и `/game/command`. Это отображение не реализует HTTP router и не
доказывает, что deployment принимает эти endpoints.

## Init

`GameInitRequest` содержит `game_name`. Ответ содержит `int32` `balance`, строку
`currency_code`, repeated `int32` `bets`, repeated `Line` `lines`, map
`symbol_payouts` и `scatter_payouts` с ключом `int32` ID символа и repeated
`Step` `steps`.

Значение каждой payout-map — `common.v1.Payouts` с repeated `int32` `values`.
Ключи JSON-объекта являются строками даже при целочисленном protobuf-ключе.
`Line` содержит `number` и координаты `positions`.

## Command

`GameCommandRequest` содержит произвольную строку `command` и
`google.protobuf.Struct` `payload`. Он не использует `CommandType` или
`api.base.v1.Action`. Ответ содержит `uint32` `balance` и repeated `Step`
`steps`. Обратите внимание: balance в init — знаковый `int32`, в command —
беззнаковый `uint32`; оба отличаются от `int64` в `common.v1.User`.

Для структурированного payload используйте
[преобразование protobuf JSON](serialization.md):

```ts
import { fromJson } from '@bufbuild/protobuf';
import { GameCommandRequestSchema } from '@playbro-tech/game-proto';

const request = fromJson(GameCommandRequestSchema, {
  command: 'example-command',
  payload: { selection: 1 },
});
```

Имена команд и содержимое payload определяет использующий сервис. Пример
показывает создание сообщения и не задаёт поддерживаемое игровое действие.

## Шаги

Каждый `base.v1.Step` содержит один oneof `payload`:

| Proto-ветка | TypeScript case | Значение |
| --- | --- | --- |
| `symbol_ids` | `symbolIds` | `SymbolIdsStep.items`: `SymbolId` с `uint32 id` и `Position` |
| `symbol_wins` | `symbolWins` | `SymbolWinsStep.items`: `SymbolWin` с `uint32 win` и repeated `Position` |
| `symbol_multipliers` | `symbolMultipliers` | `SymbolMultipliersStep.items`: `SymbolMult` с `uint32 multiplier` и `Position` |
| `max_win_reached` | `maxWinReached` | `MaxWinReached`: `uint32 max_win_value`, optional `bool cut` |

`base.v1.Position` содержит `int32 x` и `int32 y`. Это отдельный тип,
отличающийся от `common.v1.OrthogonalPosition`, хотя оба содержат две координаты.
Список шагов сохраняет переданный порядок; схема не планирует анимации и не
вычисляет переходы состояния. Обрабатывайте отсутствующий payload в приложении,
не предполагая, что у каждого распарсенного шага выбрана ветка.

## Область OpenAPI

Сгенерированный документ описывает эти аннотированные методы и только схемы,
достижимые из их запросов и ответов. Базовых команд сессии в нём нет. Он объявляет
JSON/protobuf-форматы запроса и успеха, ответ `200`, ответ `400` только с описанием
и bearer security из конфигурации генератора. Эти декларации не определяют
полный контракт ошибок и аутентификации работающего сервера. Генерация и её
ограничения описаны в [разработке](development.md), точные номера полей — в
[справочнике схем](schema-reference.md).
