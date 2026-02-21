import { Link, NavLink } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <header>
        <Link to="/" className="brand">EuroHop</Link>
        <nav>
          {['/', '/explore', '/saved', '/settings'].map((path, i) => (
            <NavLink key={path} to={path} className={({ isActive }) => (isActive ? 'active' : '')}>
              {['Home', 'Explore', 'Saved Trips', 'Settings'][i]}
            </NavLink>
          ))}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
