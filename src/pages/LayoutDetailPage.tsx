import { Box, Eye, Lightbulb, Ruler } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FavoriteButton } from "../components/FavoriteButton";
import { FloorPlan } from "../components/FloorPlan";
import { PageHeader } from "../components/PageHeader";
import { useHouseData } from "../context/HouseDataContext";

type LayoutDetailPageProps = {
  isFavorite: (layoutId: string) => boolean;
  onToggleFavorite: (layoutId: string) => void;
};

export function LayoutDetailPage({ isFavorite, onToggleFavorite }: LayoutDetailPageProps) {
  const { layoutId } = useParams();
  const { getLayoutContext, status } = useHouseData();
  const { layout, building, community } = getLayoutContext(layoutId ?? "");

  if (!layout || !building || !community) {
    if (status === "loading") {
      return (
        <div className="page-flow">
          <section className="empty-state">
            <h2>正在读取户型详情</h2>
            <p>如果已经填写 Supabase 配置，这里会自动加载云端户型信息。</p>
          </section>
        </div>
      );
    }

    return <Navigate to="/" replace />;
  }

  return (
    <div className="page-flow">
      <PageHeader
        backTo={`/buildings/${building.id}/layouts`}
        eyebrow={`${community.name} · ${building.name}`}
        title={layout.name}
        description={layout.suitableFor}
        actions={
          <FavoriteButton
            active={isFavorite(layout.id)}
            onClick={() => onToggleFavorite(layout.id)}
            variant="primary"
          />
        }
      />

      <section className="detail-grid detail-grid-wide">
        <div className="info-panel">
          <h2>户型图</h2>
          <FloorPlan rooms={layout.floorPlan} />
        </div>
        <div className="info-panel">
          <h2>基础信息</h2>
          <div className="feature-grid">
            <span>
              <Ruler size={18} aria-hidden="true" />
              {layout.area}
            </span>
            <span>
              <Box size={18} aria-hidden="true" />
              {layout.rooms}
            </span>
            <span>{layout.orientation}</span>
            <span>{layout.priceRange}</span>
          </div>
          <h2>户型亮点</h2>
          <ul className="highlight-list">
            {layout.highlights.map((highlight) => (
              <li key={highlight}>
                <Lightbulb size={18} aria-hidden="true" />
                {highlight}
              </li>
            ))}
          </ul>
          <div className="stacked-actions">
            <Link className="button button-primary button-wide" to={`/vr/${layout.id}`}>
              <Eye size={18} aria-hidden="true" />
              进入 3D/VR 看房
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
