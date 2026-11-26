# ADHD ToDo

期限を色・残り時間バー・「今日の3つ」で見せるToDo。Firebase(Auth + Firestore) + GitHub Pages。

## セットアップ
1. Firebase コンソールでプロジェクトを作成（献立システムと統一する場合は**同じプロジェクト**を使う）
2. Authentication > ログイン方法 で Google を有効化。承認済みドメインに `<user>.github.io` を追加
3. Firestore Database を作成し、`firestore.rules` の内容を「ルール」に貼って公開
   （献立システムのルールがある場合は、`users/{uid}/tasks` の `match` ブロックだけ追記）
4. プロジェクトの設定 > マイアプリ(Web) の値を `.env.local`（`.env.example` を参照）に入れる
5. `npm i && npm run dev`

## 公開
GitHub リポジトリ作成 > Settings > Pages で Source を「GitHub Actions」に変更 >
Settings > Secrets に `.env.example` の4つを登録 > main に push。
