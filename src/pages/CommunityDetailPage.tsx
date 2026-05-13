import { ArrowRight, Building2, MapPinned, School, ShoppingBag } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { PageHeader } from "../components/PageHeader";
import { getBuildingsByCommunity, getCommunity } from "../utils/dataLookup";

const amenityIcon = {
  交通: MapPinned,
  学校: School,
  商业: ShoppingBag,
  医疗: Building2,
  公园: MapPinned,
};

export function CommunityDetailPage() {
  const { communityId } = useParams();
  const community = getCommunity(communityId);

  if (!community) {
    return <Navigate to="/" replace />;
  }

  const communityBuildings = getBuildingsByCommunity(community.id);

  return (
    <div className="page-flow">
      <PageHeader
        backTo="/"
        eyebrow={`${community.district} · ${community.averagePrice}`}
        title={community.name}
        description={community.intro}
      />

      <section className="detail-grid">
        <div className="info-panel">
          <h2>小区基础信息</h2>
          <dl className="detail-list">
            <div>
              <dt>位置</dt>
              <dd>{community.address}</dd>
            </div>
            <div>
              <dt>价格</dt>
              <dd>{community.priceRange}</dd>
            </div>
            <div>
              <dt>在售户型</dt>
              <dd>{communityBuildings.reduce((sum, building) => sum + building.layoutIds.length, 0)} 个</dd>
            </div>
          </dl>
        </div>

        <div className="info-panel">
          <h2>周边配套</h2>
          <div className="amenity-list">
            {community.amenities.map((amenity) => {
              const Icon = amenityIcon[amenity.kind];
              return (
                <span className="amenity-pill" key={`${amenity.kind}-${amenity.name}`}>
                  <Icon size={16} aria-hidden="true" />
                  {amenity.kind} · {amenity.name} {amenity.distance}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">关联楼盘</span>
          <h2>继续选择具体楼盘</h2>
        </div>
        <div className="building-grid">
          {communityBuildings.map((building) => (
            <article className="building-card" key={building.id}>
              <div className="building-cover">
                <Building2 size={30} aria-hidden="true" />
                <span>{building.cover}</span>
              </div>
              <div className="card-content">
                <span className="card-kicker">楼盘</span>
                <h3>{building.name}</h3>
                <p>{building.intro}</p>
                <div className="meta-grid">
                  <span>{building.mainLayouts}</span>
                  <span>{building.priceRange}</span>
                </div>
                <Link className="button button-primary" to={`/buildings/${building.id}`}>
                  查看楼盘
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
