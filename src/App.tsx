import { Navigate, Route, Routes } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import { useFavorites } from "./hooks/useFavorites";
import { BuildingDetailPage } from "./pages/BuildingDetailPage";
import { CommunityDetailPage } from "./pages/CommunityDetailPage";
import { FavoritesPage } from "./pages/FavoritesPage";
import { HomePage } from "./pages/HomePage";
import { LayoutDetailPage } from "./pages/LayoutDetailPage";
import { LayoutListPage } from "./pages/LayoutListPage";
import { VrPage } from "./pages/VrPage";

export default function App() {
  const favorites = useFavorites();

  return (
    <Routes>
      <Route element={<AppShell favoriteCount={favorites.favoriteCount} />}>
        <Route index element={<HomePage />} />
        <Route path="communities/:communityId" element={<CommunityDetailPage />} />
        <Route path="buildings/:buildingId" element={<BuildingDetailPage />} />
        <Route
          path="buildings/:buildingId/layouts"
          element={
            <LayoutListPage
              isFavorite={favorites.isFavorite}
              onToggleFavorite={favorites.toggleFavorite}
            />
          }
        />
        <Route
          path="layouts/:layoutId"
          element={
            <LayoutDetailPage
              isFavorite={favorites.isFavorite}
              onToggleFavorite={favorites.toggleFavorite}
            />
          }
        />
        <Route
          path="vr/:layoutId"
          element={
            <VrPage isFavorite={favorites.isFavorite} onToggleFavorite={favorites.toggleFavorite} />
          }
        />
        <Route
          path="favorites"
          element={
            <FavoritesPage
              favoriteIds={favorites.favoriteIds}
              isFavorite={favorites.isFavorite}
              onToggleFavorite={favorites.toggleFavorite}
              onRemoveFavorite={favorites.removeFavorite}
            />
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
