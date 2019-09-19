import Document, {Html, Head, Main, NextScript} from 'next/document';

const style = `
html, body, #__next {
  position: relative;
  height: 100%;
  width: 100%;
  padding: 0;
  margin: 0;
}
html, body {
  font-size: 16px;
  overflow-y: auto;
  margin: 0;
  padding: 0;
  font-family: 'Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif';
}
@media (max-width: 992px) {
  html, body {
    font-size: 8px;
  }
}
* {
  box-sizing: border-box;
}

::selection{
  background: #00adb5;
  color: #fff;
}

a:link, a:visited, a:hover, a:active {
  transition: all 0.2s;
  text-decoration: none;
}

a:link, a:visited {
  color: #00adb5;
}

a:hover, a:active {
  color: #222831;
}

.avatar {
  width: 4.5rem;
  height: 4.5rem;

  background-position: center;
  background-repeat: no-repeat;
  background-size: 100%;
}
`

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                  <meta name='viewport' content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' />
                  <link rel="icon" href="/static/favicon.ico" type="image/x-icon"></link>
                  <style>{style}</style>
                  {/* <script src="//cdn.jsdelivr.net/npm/leancloud-storage@3.12.0/dist/av-min.js"></script> */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument;
