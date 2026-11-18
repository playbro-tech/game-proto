# Schema development and generated documentation

Human translation: [Русский](../ru/development.md).

## Sources and prerequisites

Edit the `.proto` files under `proto/`. Buf configuration uses a v2 module,
Google APIs dependencies, `STANDARD` lint and `FILE` breaking rules. Generated
TypeScript is not the owning source. The package uses pnpm `10.12.1`; its
manifest does not declare a Node engine range. Vite 7 and the installed tools
require a compatible modern Node runtime. The existing `.npmrc` supplies registry
configuration; keep authentication out of documentation and generated output.

Install locked dependencies from the repository root:

```bash
pnpm install --frozen-lockfile
```

## Generation pipeline

`pnpm proto:generate` first runs `clean`, which removes **all of `src/`**, then
invokes `buf generate`. Do not keep hand-written files there. `buf.gen.yaml`
configures three local plugins:

1. `protoc-gen-es` generates TypeScript messages, enums, file/service descriptors
   under `src/`, with imported schemas included and `target=ts`.
2. `plugins/gen-entry.ts` exports each selected file's generated `_pb` module
   through `src/index.ts`.
3. `plugins/protoc-gen-openapi.ts` writes `dynamic/openapi.yaml` through the
   custom OpenAPI builder/mapper.

`pnpm proto:build` regenerates, then builds with Vite and `vite-plugin-dts`.
`pnpm build` delegates to it. Output is an ES module plus bundled declarations
and source maps in `dist/`; `@bufbuild/protobuf` stays external. Only `dist/`
is selected by the manifest's package `files` list.

## Commands and checks

| Command | Effect |
| --- | --- |
| `pnpm proto:format` | Rewrite `.proto` formatting with Buf |
| `pnpm proto:dep-update` | Update Buf dependency lock; review the resulting change |
| `pnpm proto:lint` / `pnpm lint` | Buf lint |
| `pnpm proto:generate` | Replace generated source and generate OpenAPI |
| `pnpm test` | Generate, run `tests/*.test.ts` through tsx, then Buf lint |
| `pnpm build` | Generate and build package/declarations |
| `pnpm docs:lint` | Redocly validation of `dynamic/openapi.yaml` |
| `pnpm docs:build` | Redocly HTML at `dist/docs/index.html` |
| `pnpm docs:preview` | Build Redocly HTML and open it with the host's `open` command |

For a schema change, run `pnpm test` and `pnpm build`. Generate before
`pnpm docs:lint` or `pnpm docs:build`; neither Redocly script generates its own
input. Build the package before rendering Redocly if both outputs are needed,
because the package build can replace `dist/`.

The current test suite verifies gift-mode enum numbers, optional presence,
JSON/binary round trips, response containers, terminal counters and invalid
boolean values. Passing it is not full coverage of every message or evidence of
a live server deployment. Add relevant wire-contract tests for schema changes.
Buf's configured breaking rules do not by themselves execute a baseline comparison;
the repository has no `proto:breaking` script. Compare against the intended
released schema explicitly when assessing wire compatibility.

## OpenAPI behavior and limits

`redocly.yaml` selects `dynamic/openapi.yaml`, not the tracked
`docs/openapi.yaml`. The generated document uses OpenAPI 3.1, title `Game API`,
version `1.0.0` and a server URL from `plugins/openapi/config.ts`. That metadata
version is independent of the npm package version; the configured host is not
proof of availability or compatibility and is not selected by consumers at runtime.

The mapper uses proto field names, enum names, string/int64 for 64-bit integers,
object maps, arrays and oneof alternatives. It recognizes selected well-known
types, including Struct. It emits method comments but not a complete field-level
semantic reference or all business-required fields. Components are indexed by
short message name, not fully qualified name; colliding names can overwrite each
other. Only types reachable from annotated methods enter the document. Check the
result whenever changing services or adding types; do not treat this output as
a lossless replacement for the protobuf descriptors or this full schema reference.

## Compatibility and documentation maintenance

Keep existing field numbers, scalar wire types, enum numbers and presence semantics
when maintaining a compatible contract. Reserve removed field numbers/names
instead of reusing them. A binary-compatible edit can still change JSON names,
TypeScript property names, oneof cases or application behavior; review all used
representations and installed consumer versions.

Maintain matching English/Russian pages and update the
[schema reference](schema-reference.md) against all project-owned descriptors,
including message fields, numbers, optional/oneof state, deprecations, enum values
and RPC signatures. Do not include imported Google types as project-owned API.
Keep current contracts here; put a version transition in a separate migration
guide when there is an actual migration to explain. Preserve published changelog
history. The operational entry point is [AGENTS.md](../../AGENTS.md).

Source development uses GitHub `main` or an assigned task branch based on it.
GitLab `master` is the release mirror layer. The GitHub workflows delegate tests
and validation on PRs, release preparation on `main`, and publishing/Redocly docs
deployment on a published release. Editing documentation does not itself publish
a package or synchronize a mirror. The workspace documentation site separately
selects these Markdown sources; generated site copies are not edited here.
