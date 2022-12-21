import { Html, Head, Main, NextScript } from "next/document";
import { Layout } from "antd";
import AppHeader from "../components/Shared/Header";
import AppFooter from "../components/Shared/Footer";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Layout>
          <AppHeader />
          <Main />
          <NextScript />
          <AppFooter />
        </Layout>
      </body>
    </Html>
  );
}
