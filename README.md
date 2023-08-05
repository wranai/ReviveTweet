「ツイート」よ、蘇れ！ (Chrome拡張機能)
=====

- License: The MIT license  
- Copyright (c) 2023 風柳(furyu)  

[Web版Twitter(X)](https://twitter.com)の表示で、「ツイート」が「投稿」、「リツイート」が「再投稿」になったりするのが嫌だったので、「ツイート」「リツイート」を復活させてみました。  

## インストール方法(ストア)
1. Chromeで[Chrome ウェブストア](https://chrome.google.com/webstore/detail/jlbmpiaomahbmmhlpohcjgopklbndnod)からインストールしてください
2. 「拡張機能」(chrome://extensions/)を開き『「ツイート」よ、蘇れ！』が有効になっていることを確認します

この状態で[Twitter](https://twitter.com)／[TweetDeck(新版)](https://tweetdeck.twitter.com)を開くと、[投稿する]等の文字列が置き換わる……はずです。  

## インストール方法(ローカル)
1. [Code ▼]＞Download ZIP等で一式を取得し、ローカルの適当な場所に展開します
2. Chromeで「拡張機能」(chrome://extensions/)を開き、デベロッパーモードをONにして、[パッケージ化されていない拡張機能を読み込む]ボタンから、1. で展開したフォルダ中の「src」フォルダ(manifest.jsonが存在するフォルダ)を指定します
3. 『「ツイート」よ、蘇れ！』が有効になっていることを確認します

この状態で[Twitter](https://twitter.com)／[TweetDeck(新版)](https://tweetdeck.twitter.com)を開くと、[投稿する]等の文字列が置き換わる……はずです。  

## 注意書き
- 動作保証は当然ありません、利用して発生した不具合等については当方は一切関知いたしません
- いちおう、manifest.jsonをmanifest.firefox.jsonの中身で上書きしてやればFirefox用になりますが、どうも動作が怪しいです→0.0.1.6でManifest V2に変更したところ、安定した気がします
- 悪趣味な「𝕏」のアイコンも見慣れた鳥のアイコンに置き換えたいところですが、この拡張機能では対応していませんので、[twitter_icon_x_to_bird](https://chrome.google.com/webstore/detail/twittericonxtobird/iepkmhnkbldjmmgaekphkbiffjehajal?hl=ja)等を利用して置換してやりましょう……

## つぶやき
拡張機能で[Twitter](https://twitter.com)上に任意のSCRIPT要素を埋め込むためのもっとスマートな方法か、もしくは埋め込まなくても同様の機能を実現するクレバーな方法をどなたか教えてください……。  
