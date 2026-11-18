# Сериализация и присутствие полей

Канонический источник: [English](../en/serialization.md).

## Три представления

| Схема | Сгенерированный TypeScript | Protobuf JSON |
| --- | --- | --- |
| Поле `snake_case` | Свойство `camelCase` | По умолчанию lowerCamelCase; proto-имя с `useProtoFieldName: true` |
| `int32`, `uint32`, `double` | `number` | JSON-число |
| `int64` | `bigint` | Десятичная строка |
| `bool`, `string` | `boolean`, `string` | Boolean, строка |
| enum | Числовое значение enum | По умолчанию объявленное имя значения enum |
| repeated-поле | Массив | Массив; пустой по умолчанию опускается |
| map | Объект со строковыми ключами | JSON-объект |
| Поле-сообщение | Сообщение или `undefined` | Объект; отсутствующее поле опускается |

Примеры на страницах протокола используют proto-имена полей. Для получения
такой записи используйте `toJson(schema, message, { useProtoFieldName: true })`.
`fromJson` принимает proto-имена и JSON-имена lowerCamelCase. Binary-кодирование
использует номера и wire-типы полей, а не варианты написания имён.

Используйте `create`, `fromJson`, `toJson`, `fromBinary` и `toBinary` protobuf
runtime с соответствующим дескриптором. Обычный JSON-объект не является
сгенерированным сообщением. `JSON.stringify` не заменяет `toJson`: сообщение
может содержать `bigint`, protobuf-метаданные и другую структуру полей.

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

Сохраняйте точность 64-битных сумм. Преобразование произвольного `bigint` в
JavaScript `number` может потерять точность. Пакет не предоставляет форматирование
денег или общее преобразование denominator. Отображение и масштабирование
определяются единицами конкретного поля и контрактом интеграции.

## Присутствие и валидация

Скалярные proto3-поля без `optional` имеют неявные значения по умолчанию: `0`,
`0n`, `false`, `''` или нулевое значение enum. После декодирования нельзя
отличить отсутствие такого поля от его default. По умолчанию JSON-вывод
опускает эти значения. Repeated-поля и map инициализируются пустыми контейнерами
и не сохраняют presence.

Явные `optional`-скаляры сохраняют отсутствие как `undefined`. Явно переданные
`false`, `0` и пустая строка остаются присутствующими, в том числе в JSON по
умолчанию. Поля-сообщения имеют presence даже без ключевого слова `optional`;
JSON `null` не создаёт заполненное сообщение. Значение отсутствующего `paused`
для бизнес-логики описано в [gift mode](gift-mode.md).

Парсер проверяет protobuf-структуры и диапазоны скаляров; он не требует token
для login, action для play, соответствия команды типу сообщения, попадания
координат в поле или оффера в подтверждении. `fromJson` по умолчанию отклоняет
неизвестные JSON-поля. `ignoreUnknownFields: true` применяйте только если
интеграция намеренно допускает и отбрасывает их. Это выбор совместимости, а не
доказательство, что пакет описывает все дополнительные поля сервера.

## Oneof и структурированные значения

`base.v1.Step` использует `oneof payload`. В TypeScript это discriminated union:

```ts
import { create } from '@bufbuild/protobuf';
import { StepSchema } from '@playbro-tech/game-proto';

const step = create(StepSchema, {
  payload: { case: 'symbolIds', value: { items: [{ id: 7, position: { x: 0, y: 0 } }] } },
});
```

У незаполненного payload `case: undefined`. В protobuf JSON выбранное поле
находится прямо в шаге, например
`{"symbol_ids":{"items":[{"id":7,"position":{}}]}}` с proto-именами и
опущенными default-скалярами. Оболочки `payload` нет. Обрабатывайте выбранный
case, а не четыре одновременно существующих TypeScript-свойства.

`google.protobuf.Struct` используется в `Settings.paytable` и
`GameCommandRequest.payload`. В protobuf JSON это обычный JSON-объект; в
сгенерированном сообщении — protobuf well-known type. Используйте `fromJson`
или helpers runtime для well-known types, а не присваивайте произвольный объект
как готовое сообщение. Числа Struct являются JSON-числами; для точных 64-битных
целых используйте типизированное целочисленное поле.
