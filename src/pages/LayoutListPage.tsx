import { Navigate, useParams } from "react-router-dom";
import { LayoutCard } from "../components/LayoutCard";
import { PageHeader } from "../components/PageHeader";
import { useHouseData } from "../context/HouseDataContext";

type LayoutListPageProps = {
  isFavorite: (layoutId: string) => boolean;
  onToggleFavorite: (layoutId: string) => void;
};

export function LayoutListPage({ isFavorite, onToggleFavorite }: LayoutListPageProps) {
  const { buildingId } = useParams();
  const { getBuilding, getCommunity, getLayoutsByBuilding, status } = useHouseData();
  const building = getBuilding(buildingId);
  const community = building ? getCommunity(building.communityId) : undefined;

  if (!building || !community) {
    if (status === "loading") {
      return (
        <div className="page-flow">
          <section className="empty-state">
            <h2>正在读取户型列表</h2>
            <p>如果已经填写 Supabase 配置，这里会自动加载云端户型信息。</p>
          </section>
        </div>
      );
    }

    return <Navigate to="/" replace />;
  }

  const buildingLayouts = getLayoutsByBuilding(building.id);

  return (
    <div className="page-flow">
      <PageHeader
        backTo={`/buildings/${building.id}`}
        eyebrow={`${community.name} · ${building.name}`}
        title="户型列表"
        description="先比较面积、价格和房间数量，再进入详情页或 3D 看房页。"
      />

      <section className="layout-list">
        {buildingLayouts.map((layout) => (
          <LayoutCard
            layout={layout}
            isFavorite={isFavorite(layout.id)}
            onToggleFavorite={onToggleFavorite}
            key={layout.id}
          />
        ))}
      </section>
    </div>
  );
}
