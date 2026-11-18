# game-proto

Read the English [overview](docs/en/README.md) before working on this package.
Select the relevant contract rather than loading every page:

| Task | Source |
| --- | --- |
| Install or consume the package | [Installation](docs/en/installation.md) |
| Parse, construct or encode messages | [Serialization](docs/en/serialization.md) |
| Integrate session commands | [Base API](docs/en/base-api.md) |
| Integrate the annotated service | [GameService](docs/en/game-service.md) |
| Interpret game state | [Data models](docs/en/models.md) |
| Inspect fields, tags or enum values | [Schema reference](docs/en/schema-reference.md) |
| Change gift mode | [Gift-mode contract](docs/en/gift-mode.md) |
| Edit schemas, generate outputs or run checks | [Development](docs/en/development.md) |

The `.proto` files own the wire contract. Generated `src/`, `dynamic/` and
`dist/` are build outputs. Documentation describes the checked-out schema and
does not establish deployment in a consumer or backend.
