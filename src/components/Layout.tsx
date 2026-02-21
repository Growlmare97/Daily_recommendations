import { Link, NavLink } from 'react-router-dom';

const nav = [
  { path: '/', label: 'Home' },
  { path: '/explore', label: 'Explore' },
  { path: '/saved', label: 'Saved' },
  { path: '/settings', label: 'Settings' }
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-orb">
      <div className="app-shell">
        <header className="topbar glass">
          <Link to="/" className="brand">✈️ EuroHop</Link>
          <nav>
            {nav.map((item) => (
              <NavLink key={item.path} to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
