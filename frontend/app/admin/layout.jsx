import React from "react";

const AdminLayout = ({ children }) => {
  return (
    <div className="admin-layout">
      <header className="admin-header">
        <h1>Admin Panel</h1>
      </header>
      <nav className="admin-sidebar">
        <ul>
          <li>
            <a href="/admin/dashboard">Dashboard</a>
          </li>
          <li>
            <a href="/admin/users">Users</a>
          </li>
          <li>
            <a href="/admin/settings">Settings</a>
          </li>
        </ul>
      </nav>
      <main className="admin-content">{children}</main>
      <footer className="admin-footer">
        <p>&copy; {new Date().getFullYear()} Admin Panel</p>
      </footer>
    </div>
  );
};

export default AdminLayout;
