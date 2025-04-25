import React from "react";

export default function Layout({ children }) {
  return (
    <div className="layout">
      <header>
        <h1>Site Header</h1>
      </header>
      <main>{children}</main>
      <footer>
        <p>Site Footer</p>
      </footer>
    </div>
  );
}
