export default function Layout({ children }) {
    return (
        <div>
            <header>
                <h1>Profile Page</h1>
            </header>
            <main>{children}</main>
        </div>
    );
}