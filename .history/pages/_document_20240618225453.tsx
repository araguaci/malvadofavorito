import Document, { Head, Html, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" href="/favicon.ico" />
          <title>💠Meu Malvado Favorito💠</title>
          <meta
            property="og:image"
            content="https://e0.pxfuel.com/wallpapers/614/1019/desktop-wallpaper-despicable-me-2-minions-x-post-from-i-black-minion.jpg"
          />
          <meta name="twitter:card" content="summary" />
          <meta property="twitter:title" content="💠Meu Malvado Favorito💠" />
          <meta
            property="twitter:description"
            content="Índices e resultados do último governo e atual administração."
          />
          <meta
            property="twitter:image"
            content="https://e0.pxfuel.com/wallpapers/614/1019/desktop-wallpaper-despicable-me-2-minions-x-post-from-i-black-minion.jpg"
          />
          <meta
            property="twitter:url"
            content="https://malvadofavorito.vercel.app/"
          />
        </Head>
        <body className="bg-black antialiased">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
