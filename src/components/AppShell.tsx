import { Building2, Heart, Home, MapPinned } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

type AppShellProps = {
  favoriteCount: number;
};

export function AppShell({ favoriteCount }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="回到首页">
          <span className="brand-mark">
            <Building2 size={22} aria-hidden="true" />
          </span>
          <span>
            <strong>3D 看房</strong>
            <small>第一版 Demo</small>
          </span>
        </NavLink>

        <nav className="topnav" aria-label="主要导航">
          <NavLink to="/" className="nav-link">
            <MapPinned size={18} aria-hidden="true" />
            首页
          </NavLink>
          <NavLink to="/favorites" className="nav-link">
            <Heart size={18} fill="currentColor" aria-hidden="true" />
            收藏
            <span className="nav-count">{favoriteCount}</span>
          </NavLink>
        </nav>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <nav className="bottom-nav" aria-label="移动端主要导航">
        <NavLink to="/" className="bottom-nav-item">
          <Home size={20} aria-hidden="true" />
          首页
        </NavLink>
        <NavLink to="/favorites" className="bottom-nav-item">
          <Heart size={20} fill="currentColor" aria-hidden="true" />
          收藏 {favoriteCount > 0 ? favoriteCount : ""}
        </NavLink>
      </nav>
    </div>
  );
}
