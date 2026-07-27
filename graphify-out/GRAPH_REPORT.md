# Graph Report - C:\Users\skyli\Project\FamilyFund  (2026-07-27)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 114 nodes · 201 edges · 7 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a4575d9b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- App.tsx
- FundContext.tsx
- dependencies
- compilerOptions
- devDependencies
- package.json

## God Nodes (most connected - your core abstractions)
1. `useFund()` - 21 edges
2. `compilerOptions` - 15 edges
3. `Member` - 9 edges
4. `FundContextType` - 8 edges
5. `ARABIC_MONTHS` - 7 edges
6. `scripts` - 6 edges
7. `MonthNumber` - 6 edges
8. `ActiveTab` - 5 edges
9. `FundProvider()` - 4 edges
10. `generateInitialPayments()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `MainContent()` --calls--> `useFund()`  [EXTRACTED]
  src/App.tsx → src/context/FundContext.tsx
- `MembersViewProps` --references--> `Member`  [EXTRACTED]
  src/components/MembersView.tsx → src/types.ts
- `AddMemberModalProps` --references--> `Member`  [EXTRACTED]
  src/components/modals/AddMemberModal.tsx → src/types.ts
- `FundContextType` --references--> `Member`  [EXTRACTED]
  src/context/FundContext.tsx → src/types.ts
- `BottomNav()` --calls--> `useFund()`  [EXTRACTED]
  src/components/BottomNav.tsx → src/context/FundContext.tsx

## Import Cycles
- None detected.

## Communities (7 total, 0 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.18
Nodes (15): MainContent(), BottomNav(), DashboardView(), Header(), HeaderProps, HistoryView(), MembersView(), MembersViewProps (+7 more)

### Community 1 - "FundContext.tsx"
Cohesion: 0.22
Nodes (16): NewPaymentModalProps, PaymentMatrixProps, FundContext, FundContextType, FundProvider(), STORAGE_KEYS, ARABIC_MONTHS, generateInitialPayments() (+8 more)

### Community 2 - "dependencies"
Cohesion: 0.11
Nodes (19): dotenv, express, @google/genai, lucide-react, motion, dependencies, dotenv, express (+11 more)

### Community 3 - "compilerOptions"
Cohesion: 0.11
Nodes (18): DOM, DOM.Iterable, ES2022, compilerOptions, allowImportingTsExtensions, allowJs, experimentalDecorators, isolatedModules (+10 more)

### Community 4 - "devDependencies"
Cohesion: 0.11
Nodes (18): autoprefixer, esbuild, vite, devDependencies, autoprefixer, esbuild, tailwindcss, tsx (+10 more)

### Community 5 - "package.json"
Cohesion: 0.18
Nodes (10): name, private, scripts, build, clean, dev, lint, preview (+2 more)

## Knowledge Gaps
- **46 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+41 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `devDependencies`, `package.json`?**
  _High betweenness centrality (0.109) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.090) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _46 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._