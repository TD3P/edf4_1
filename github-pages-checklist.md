# GitHub Pages 公開チェックリスト

## 公開前チェック

### ファイル構成確認
- [ ] index.html が存在する
- [ ] styles.css が存在する  
- [ ] script.js が存在する
- [ ] weaponData.json が存在する
- [ ] 背景画像ファイルが存在する

### 相対パス確認
- [ ] CSS: `<link rel="stylesheet" href="styles.css">`
- [ ] JS: `<script src="script.js"></script>`
- [ ] 背景画像: `background: url('./back2.jpg')`
- [ ] 武器データ: `fetch('./weaponData.json')`

### 動作テスト
- [ ] ローカルでHTTPサーバーで動作確認
- [ ] 武器データが正常に読み込まれる
- [ ] チェック機能が動作する
- [ ] ローカルストレージが動作する

## 公開手順

### 1. GitHub Pagesの設定
1. GitHubリポジトリの「Settings」→「Pages」
2. Source: "Deploy from a branch"
3. Branch: "main" / Folder: "/ (root)"
4. 「Save」をクリック

### 2. 公開URL
```
https://YOURUSERNAME.github.io/REPONAME/
```

### 3. 公開後テスト
- [ ] URLにアクセスできる
- [ ] 武器データが読み込まれる
- [ ] 全機能が正常動作する
- [ ] モバイルでも動作する

## トラブルシューティング

### よくある問題

1. **ページが表示されない**
   - ファイル名が正確か確認
   - index.html が存在するか確認
   - 数分待ってから再度アクセス

2. **CSSが適用されない** 
   - パスが相対パスになっているか確認
   - ファイル名の大文字小文字を確認

3. **JavaScriptエラー**
   - ブラウザの開発者ツールでエラー確認
   - 相対パスが正しいか確認

4. **武器データが読み込まれない**
   - weaponData.json の存在確認
   - JSON形式が正しいか確認
   - CORSエラーでないか確認（GitHub Pagesでは通常問題なし）

## カスタムドメイン設定（オプション）

### 独自ドメインを使いたい場合
1. ドメインを取得
2. リポジトリに CNAME ファイルを作成
3. ドメインのDNS設定を変更
4. GitHub Pages設定でカスタムドメインを指定

### CNAME ファイルの例
```
yourdomain.com
```
