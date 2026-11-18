# Модели сессии и игрового состояния

Канонический источник: [English](../en/models.md).

Страница объясняет `common.v1` и `domain.v1` из [базового API](base-api.md).
Точные поля, скалярные типы, presence и номера находятся в
[справочнике схем](schema-reference.md), представления — в
[сериализации](serialization.md). Отдельная модель шагов `base.v1` описана
вместе с [GameService](game-service.md).

## Пользователь и настройки

`User` содержит `int64 balance`, `currency_code` и `currency`. Баланс выражен
в минимальных денежных единицах, определённых интеграцией. Коды валют могут
быть ISO 4217 или кодами виртуальных валют.

`Settings` содержит `bet_per_spin`, `bet_factor`, `bets`, `currency_format`,
`paytable`, optional `buy_freespin`, `buy_features` и состояния `collector_vault`.
Ставки и коэффициенты используют 64-битные целочисленные поля. `paytable` —
открытый `google.protobuf.Struct`; схема не ограничивает внутренние ключи.

`CurrencyFormat.currency_style` и `.style` являются строками, хотя отдельно
существуют enum `CurrencyType` и `CurrencyStyle`. Типичные документированные
строки: `symbol`, `code`, `hidden` или пустая для `currency_style`, `money`,
`fun`, `crypto` для `style`. `bet_multiplier_exponent` — целочисленный параметр,
а не реализованный formatter или функция масштабирования.

`BuyFreespin` содержит доступность и множитель ставки. `BuyFeature` содержит
ID, `int32 price`, optional-имя и optional `Params.choice` (`int64[]`).
`SymbolPayoutData` оборачивает типизированные `SymbolPayout` (`type`,
`double multiplier`, optional `freespins`, optional-строка `trigger`); он
экспортируется, но не заменяет `Settings.paytable`. У `SymbolPayout` нет
действующего поля `occurrences`. Не считайте, что все поля сумм имеют один тип.

## Контекст и раунды

`Context.actions` — список имён доступных действий; `current` — строка,
например `spins`, `freespins` или `bonus`, а не enum. Контекст может содержать
`gift_spin`, `spins`, `freespins`, optional `buy_feature_data` и `bonus`.
Это не oneof. Парсер не выбирает активный режим и не очищает неактивные блоки.
Приложение интерпретирует подтверждённый контекст по контракту игры. Само
наличие оффера не запускает игру; семантику промо-оффера определяет
[gift mode](gift-mode.md).

| Модель | Основная ответственность |
| --- | --- |
| `Spins` | Ставка/выигрыш раунда, линии, экран, каскады, множители спина/фичи, max win, денежные матрицы, collector, random event и события |
| `Freespins` | Данные раунда, оставшиеся/выданные/общие спины, накопленный выигрыш, события и постоянные модификаторы фичи |
| `Bonus` | Бонус без фриспинов: режим, данные/счётчики раунда, денежное поле, collector, три слота booster и дополнительные множители |

Суммы раунда, optional `bet_per_line`, счётчики бонуса/фриспинов и общие
выигрыши имеют тип `int64`. `Freespins.rounds_total` — всего **выданных**
спинов, включая retrigger; расход спина уменьшает `rounds_left`, не уменьшая
total. `Bonus.rounds_total` описан как число **сыгранных** бонусных спинов.
Одинаковое имя поля не означает одинаковую семантику счётчика. Принимайте
подтверждённые счётчики как состояние, не прибавляя `rounds_granted` повторно
к уже обновлённому total. Завершение анимаций, ожидающие действия и settlement
принадлежат жизненному циклу игры.

## Поля, выигрыши и каскады

`OrthogonalPosition` использует индексы с нуля: x — барабан/колонка слева,
y — строка сверху. `IdList.ids` оборачивает беззнаковые ID символов; repeated
`IdList` представляет матрицу, а не поле сообщения типа `number[][]`.
`ValueList.values` — аналогичная обёртка знаковых 64-битных сумм. Матрицы
денежного поля явно используют по одной записи на колонку барабана; размеры
поля и значения символов определяются контрактом игры.

`ScreenResult` содержит `reels`, `symbol_win` и `scatters`. Каждый `WinData`
содержит ID символа, `int64 amount`, позиции и optional line, `Trigger` и
выданные фриспины. `Line` описывает нумерованные линии; `Payouts.values`
принадлежит payout-map API шагов. Они отличаются от рассчитанного выигрыша.

`Cascade` содержит `reels`, `clusters`, разблокированные/заблокированные клетки,
перемещения блокированных клеток, события и scatters. `moved_blocked_cells` —
список сообщений `Movement` с `from_x`, `from_y`, `to_x`, `to_y`, а не массивов
из четырёх чисел. Пакет сериализует порядок и состояние каскадов; время удаления
и падения, агрегация выплат и представление событий принадлежат интеграции.

## Множители, события и покупки

`Multipliers` содержит плоский список `SymbolMultiplier`, матрицу и
`total_multiplier` спина. Множитель символа имеет позицию, `int64` value и
optional `Trigger`. `GlobalMultiplier` содержит значение уровня фичи и
optional trigger. Сложение, сброс и применение определяются игрой.

`Trigger` различает `FREESPINS`, `RETRIGGER_FREESPINS`, `MAXWIN`, `BONUS` и
нулевое unspecified. `MaxWin` содержит `uint32 value` и optional `cut`;
это отдельный тип, отличный от `MaxWinReached.max_win_value` в API шагов.

`Event` содержит `EventType`, optional `int32 value`, затронутые координаты,
optional-имя/категорию цели и ID символов. Enum включает обновление множителя,
boom, selection, line, transition, anticipation и случайный множитель.
`FeatureModifier` представляет сохраняемое правило фичи: строковый тип,
optional `int64 value`, категория цели, символы и позиции. Событие и постоянный
модификатор не взаимозаменяемы.

`BuyFeatureData` содержит optional name/type и разблокированные клетки.
`BuyFeatureType` различает отсутствие покупки, standard, super и mystery.
Значения enum не валидируют цены, гарантированные scatters, вероятности и
число спинов каждой игры. Эти значения принадлежат настройкам/правилам игры.

## Данные hold-and-win

`MoneyBoard` содержит матрицы сумм и множителей, новые `MoneySymbol`,
`round_left` и `total_win`. Ноль в матрице обозначает пустую клетку.
`CollectorVault.total_money` — текущий прогресс сбора;
`CollectorVaultState` задаёт ID состояния и включительные границы `from`/`to`
в настройках.

`RandomEvent` содержит имя запущенного действия и участвующие позиции.
`AdditionalMultiplier` содержит имя правила завершения, значение и позиции.
`Booster` содержит `BoosterType`, `int64 value` и клетки `BoosterTarget` с
суммами после применения booster. Типы — boost, spawn, reroll и нулевой
unspecified. `Bonus.booster_a`, `.booster_b` и `.booster_c` независимы и
optional. Пакет не выполняет случайные активации и не рассчитывает собранные суммы.
