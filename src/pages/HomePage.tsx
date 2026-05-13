import { ArrowRight, Building2, Cuboid, MapPinned, Search, TrainFront } from "lucide-react";
import { Link } from "react-router-dom";
import { SimulationBadge } from "../components/SimulationBadge";
import { communities } from "../data/demoData";

export function HomePage() {
  return (
    <div className="page-flow">
      <section className="home-hero">
        <div className="home-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">地图找房 · 3D 看户型</span>
            <SimulationBadge />
          </div>
          <h1>先在线上看清楚，再决定要不要线下看房</h1>
          <p>
            从小区位置、周边配套、户型信息到 3D 示意空间，这个 Demo 帮普通买房用户快速完成第一轮筛选。
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" to={`/communities/${communities[0].id}`}>
              <Search size={18} aria-hidden="true" />
              开始看房
            </Link>
            <Link className="button button-secondary" to="/vr/river-89">
              <Cuboid size={18} aria-hidden="true" />
              体验 3D 看房
            </Link>
          </div>
          <div className="hero-stats" aria-label="演示数据概览">
            <span>
              <strong>{communities.length}</strong>
              个小区
            </span>
            <span>
              <strong>7</strong>
              个户型
            </span>
            <span>
              <strong>3</strong>
              种装修风格
            </span>
          </div>
        </div>

        <div className="home-visual" aria-label="明亮住宅看房示意">
          <div className="hero-photo" />
          <div className="hero-visual-card">
            <span>今日推荐</span>
            <strong>{communities[0].name}</strong>
            <small>{communities[0].district} · {communities[0].priceRange}</small>
          </div>
          <div className="hero-visual-note">
            <MapPinned size={18} aria-hidden="true" />
            先确认位置，再进入户型和 3D 空间
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">地图找房</span>
          <h2>把小区位置先看明白</h2>
        </div>
        <div className="map-panel" aria-label="城市地图示意">
          <div className="map-grid" />
          <div className="map-river" />
          {communities.map((community) => (
            <Link
              to={`/communities/${community.id}`}
              className={`map-pin ${community.id === "river-garden" ? "map-pin-warm" : ""}`}
              style={{ left: `${community.mapPosition.x}%`, top: `${community.mapPosition.y}%` }}
              key={community.id}
              aria-label={`查看${community.name}`}
            >
              <MapPinned size={18} aria-hidden="true" />
              <span>{community.name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">小区点位</span>
          <h2>先看位置，再看详情</h2>
        </div>
        <div className="community-grid">
          {communities.map((community) => (
            <article className="community-card" key={community.id}>
              <div className="card-icon">
                <Building2 size={22} aria-hidden="true" />
              </div>
              <div className="card-content">
                <h3>{community.name}</h3>
                <p>{community.district} · {community.priceRange}</p>
                <div className="info-line">
                  <TrainFront size={16} aria-hidden="true" />
                  {community.amenities[0].name} {community.amenities[0].distance}
                </div>
                <Link className="text-link" to={`/communities/${community.id}`}>
                  查看小区详情
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
