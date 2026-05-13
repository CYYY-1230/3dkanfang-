import { ArrowRight, Building2, ListChecks } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { useHouseData } from "../context/HouseDataContext";

export function BuildingDetailPage() {
  const { buildingId } = useParams();
  const { getBuilding, getCommunity, getLayoutsByBuilding, status } = useHouseData();
  const building = getBuilding(buildingId);
  const community = building ? getCommunity(building.communityId) : undefined;

  if (!building || !community) {
    if (status === "loading") {
      return (
        <div className="page-flow">
          <section className="empty-state">
            <h2>正在读取楼盘数据</h2>
            <p>如果已经填写 Supabase 配置，这里会自动加载云端楼盘信息。</p>
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
        backTo={`/communities/${community.id}`}
        eyebrow={`${community.name} · ${building.priceRange}`}
        title={building.name}
        description={building.intro}
        actions={
          <Link className="button button-primary" to={`/buildings/${building.id}/layouts`}>
            <ListChecks size={18} aria-hidden="true" />
            看户型列表
          </Link>
        }
      />

      <section className="building-hero-panel">
        <div className="building-image">
          <Building2 size={42} aria-hidden="true" />
          <span>{building.cover}</span>
        </div>
        <div className="info-panel">
          <h2>楼盘信息</h2>
          <dl className="detail-list">
            <div>
              <dt>所属小区</dt>
              <dd>{community.name}</dd>
            </div>
            <div>
              <dt>主力户型</dt>
              <dd>{building.mainLayouts}</dd>
            </div>
            <div>
              <dt>价格区间</dt>
              <dd>{building.priceRange}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">户型入口</span>
          <h2>这个楼盘下的户型</h2>
        </div>
        <div className="simple-list">
          {buildingLayouts.map((layout) => (
            <Link className="simple-row" to={`/layouts/${layout.id}`} key={layout.id}>
              <span>
                <strong>{layout.name}</strong>
                <small>{layout.rooms} · {layout.area} · {layout.orientation}</small>
              </span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
