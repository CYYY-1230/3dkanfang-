import { Eye, HeartOff } from "lucide-react";
import { Link } from "react-router-dom";
import { FloorPlan } from "../components/FloorPlan";
import { PageHeader } from "../components/PageHeader";
import { useHouseData } from "../context/HouseDataContext";

type FavoritesPageProps = {
  favoriteIds: string[];
  isFavorite: (layoutId: string) => boolean;
  onToggleFavorite: (layoutId: string) => void;
  onRemoveFavorite: (layoutId: string) => void;
};

export function FavoritesPage({
  favoriteIds,
  isFavorite,
  onToggleFavorite,
  onRemoveFavorite,
}: FavoritesPageProps) {
  const { getLayoutContext } = useHouseData();
  const favoriteLayouts = favoriteIds
    .map((id) => getLayoutContext(id))
    .filter((item) => item.layout && item.building && item.community);

  return (
    <div className="page-flow">
      <PageHeader
        title="收藏列表"
        eyebrow="本地保存"
        description="收藏先保存在当前浏览器里，换设备或清理浏览器后可能会消失。"
      />

      {favoriteLayouts.length === 0 ? (
        <section className="empty-state">
          <HeartOff size={34} aria-hidden="true" />
          <h2>还没有收藏户型</h2>
          <p>可以先去首页选择一个小区，再把感兴趣的户型收藏起来。</p>
          <Link className="button button-primary" to="/">
            去首页看看
          </Link>
        </section>
      ) : (
        <section className="favorites-grid">
          {favoriteLayouts.map(({ layout, building, community }) => {
            if (!layout || !building || !community) {
              return null;
            }

            return (
              <article className="favorite-card" key={layout.id}>
                <FloorPlan rooms={layout.floorPlan} compact />
                <div className="card-content">
                  <span className="card-kicker">已收藏</span>
                  <h3>{layout.name}</h3>
                  <p>{community.name} / {building.name}</p>
                  <div className="meta-grid">
                    <span>{layout.area}</span>
                    <span>{layout.priceRange}</span>
                    <span>{layout.rooms}</span>
                    <span>{layout.orientation}</span>
                  </div>
                  <div className="card-actions">
                    <Link className="button button-primary" to={`/layouts/${layout.id}`}>
                      <Eye size={18} aria-hidden="true" />
                      查看详情
                    </Link>
                    <button
                      className="button button-secondary"
                      type="button"
                      onClick={() =>
                        isFavorite(layout.id)
                          ? onRemoveFavorite(layout.id)
                          : onToggleFavorite(layout.id)
                      }
                    >
                      <HeartOff size={18} aria-hidden="true" />
                      取消收藏
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
