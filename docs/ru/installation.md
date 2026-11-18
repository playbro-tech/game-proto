# Установка и первое использование

Канонический источник: [English](../en/installation.md).

## Зависимости приложения

Установите пакет из реестра своего окружения и peer runtime
`@bufbuild/protobuf`, совместимый с `^2.11.0`:

```bash
pnpm add @playbro-tech/game-proto @bufbuild/protobuf@^2.11.0
```

Аутентификация реестра принадлежит окружению приложения. Соседний checkout
исходников не меняет установленную зависимость. Фактический контракт определяют
манифест, lockfile и установленные декларации. Исходный пакет использует pnpm
`10.12.1` для разработки; приложение сохраняет собственную политику package manager.

Артефакт содержит `dist/`, ESM-точку входа `dist/index.js` и декларации
`dist/index.d.ts`. Импортируйте публичные символы из корня пакета. Не используйте
игнорируемый `src/` и недокументированные глубокие пути. CommonJS-сборки нет.
Целевой стандарт сборки — ES2022; окружению нужны ESM и поддержка `bigint`.

## Создание сообщения

```ts
import { create, fromBinary, toBinary, toJson } from '@bufbuild/protobuf';
import { CommandType, PlayRequestSchema } from '@playbro-tech/game-proto';
import type { PlayRequest } from '@playbro-tech/game-proto';

const request: PlayRequest = create(PlayRequestSchema, {
  command: CommandType.play,
  sessionId: 'example-session',
  signKey: 'example-sign',
  action: { name: 'spin', params: { betPerLine: 10, lines: 20 } },
});

const json = toJson(PlayRequestSchema, request, { useProtoFieldName: true });
const binary = toBinary(PlayRequestSchema, request);
const restored = fromBinary(PlayRequestSchema, binary);
```

Это условные значения, а не действующие credentials или указание отправить
раунд. `json`, `binary` и `restored` показывают только локальную сериализацию.
Схема не проверяет, что сервер принимает `spin`, ставку или сессию.

Для каждого сообщения экспортируются тип TypeScript и дескриптор
`<MessageName>Schema`. Enum экспортируют runtime-значения и дескрипторы, например
`CommandTypeSchema`. `GameService` — дескриптор, а не готовый сетевой клиент.
[Справочник схем](schema-reference.md) перечисляет экспорты, принадлежащие проекту.

Перед подключением транспорта прочитайте [сериализацию](serialization.md) и
выберите используемый им контракт: [базовый API](base-api.md) или
[GameService](game-service.md).
