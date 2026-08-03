import { NavLink } from 'react-router-dom';
import { Compass, BookMarked, Settings, Clock, Download } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <nav className="sidebar glass-panel">
      <div className="sidebar-brand">
        <h1>Scogna <span className="brand-accent">Manga</span></h1>
      </div>
      <div className="sidebar-links">
        <NavLink to="/explore" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Compass size={20} />
          <span>Explore</span>
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <BookMarked size={20} />
          <span>Library</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Clock size={20} />
          <span>History</span>
        </NavLink>
        <NavLink to="/downloads" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Download size={20} />
          <span>Downloads</span>
        </NavLink>
        <div className="sidebar-spacer"></div>
        <NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default Sidebar;
