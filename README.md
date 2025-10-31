# GitHub Theme Switcher

GitHub 上のコード閲覧画面に、エディタライクなテーマを適用する Chrome 拡張です。ポップアップから VS Code Light / Dark 風テーマを切り替えられる最小構成を用意しています。

## セットアップ

```bash
npm install
npm run build
```

`dist/` ディレクトリにビルド成果物が生成されます。

## Lint の実行

TypeScript の静的解析には ESLint を利用しています。開発中やコミット前に以下を実行して問題がないか確認してください。

```bash
npm run lint
```

## フォーマット

コード整形には Prettier を利用しています。差分が大きくなる前に以下を実行してフォーマットを揃えてください。`dist/` や `node_modules/` は `.prettierignore` で除外されています。

```bash
npx prettier --write .
```

## Chrome への読み込み方法

1. Chrome を開き、`chrome://extensions/` にアクセスします。
2. 右上の「デベロッパーモード」をオンにします。
3. 「パッケージ化されていない拡張機能を読み込む」をクリックし、`dist/` ディレクトリを選択します。
4. GitHub の任意のリポジトリページにアクセスし、拡張アイコンからテーマを切り替えて表示を確認してください。

## 開発メモ

- テーマは `public/themes/*.css` を編集・追加することで拡張できます。
- テーマ定義は `src/themes.ts` に記述しており、`id` と `stylesheet` の対応を増やすことで新テーマをポップアップに表示できます。
