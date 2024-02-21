import React from "react";
import Header from "./header";
export default function Layout({ children }) {
  return (
    <div>
      <Header />

      <main>{children}</main>

      <footer></footer>
    </div>
  );
}
