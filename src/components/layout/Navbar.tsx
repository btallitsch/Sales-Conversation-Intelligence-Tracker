import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  MessageSquare,
  TrendingUp,
  LogOut,
  Menu,
  X,
  Target,
} from 'lucide-react';
import styles from './Navbar.module.css';

const navItems = [
  { to: '/dashboard', label: 'BRIEFING', icon: LayoutDashboard },
  { to: '/interactions', label: 'INTERACTIONS', icon: MessageSquare },
  { to: '/insights', label: 'PATTERNS', icon: TrendingUp },
];

export default function Navbar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await logOut();
    navigate('/login');
  }

  const initials = user?.displayName
    ? user.displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0].toUpperCase() ?? '?';

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        {/* Logo */}
        <NavLink to="/dashboard" className={styles.logo}>
          <Target size={20} className={styles.logoIcon} />
          <span>SALES<span className={styles.logoAccent}>INTEL</span></span>
        </NavLink>

        {/* Desktop nav */}
        <div className={styles.navLinks}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.navItemActive : ''}`
              }
            >
              <Icon size={15} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        {/* User section */}
        <div className={styles.userSection}>
          <div className={styles.avatar}>{initials}</div>
          <span className={styles.userName}>
            {user?.displayName ?? user?.email?.split('@')[0]}
          </span>
          <button
            className={styles.logoutBtn}
            onClick={handleLogout}
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className={styles.mobileToggle}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${styles.mobileNavItem} ${isActive ? styles.mobileNavItemActive : ''}`
              }
              onClick={() => setMenuOpen(false)}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
          <button className={styles.mobileLogout} onClick={handleLogout}>
            <LogOut size={16} />
            SIGN OUT
          </button>
        </div>
      )}
    </nav>
  );
}
