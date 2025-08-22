# EDF4.1 武器チェックリスト - サーバー起動方法

## CORSエラーの解決

JSONファイルの読み込みでCORSエラーが発生している場合、以下のいずれかの方法でローカルサーバーを起動してください。

### 方法1: Python（推奨）

```bash
# EDF4_1ディレクトリに移動
cd /Users/ted/development/EDF4_1

# Python 3でHTTPサーバーを起動
python3 -m http.server 8000

# または Python 2の場合
python -m SimpleHTTPServer 8000
```

その後、ブラウザで http://localhost:8000 にアクセス

### 方法2: Node.js

```bash
# live-serverをインストール（グローバル）
npm install -g live-server

# EDF4_1ディレクトリで実行
cd /Users/ted/development/EDF4_1
live-server
```

### 方法3: VS Code Live Server

1. VS Codeで「Live Server」拡張機能をインストール
2. index.htmlを右クリック
3. "Open with Live Server"を選択

### 方法4: PHP

```bash
cd /Users/ted/development/EDF4_1
php -S localhost:8000
```

## トラブルシューティング

### ポートが使用中の場合
```bash
# 別のポートを指定
python3 -m http.server 8080
```

### macOSでPythonが見つからない場合
```bash
# Homebrewでインストール
brew install python3

# またはpython3コマンドを試す
python3 -m http.server 8000
```