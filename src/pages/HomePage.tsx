import { ArrowRight, Building2, Cuboid, MapPinned, Search, TrainFront } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AmapCommunityMap } from "../components/AmapCommunityMap";
import { SimulationBadge } from "../components/SimulationBadge";
import { getDataSourceLabel, useHouseData } from "../context/HouseDataContext";
import type { Layout } from "../types";

type AreaFilter = "all" | "compact" | "comfort" | "large";
type PriceFilter = "all" | "under550" | "550to700" | "over700";
type RoomFilter = "all" | "2" | "3" | "4";

const areaOptions: Array<{ label: string; value: AreaFilter }> = [
  { label: "不限", value: "all" },
  { label: "85㎡ 以下", value: "compact" },
  { label: "86-105㎡", value: "comfort" },
  { label: "106㎡ 以上", value: "large" },
];

const priceOptions: Array<{ label: string; value: PriceFilter }> = [
  { label: "不限", value: "all" },
  { label: "550 万以下", value: "under550" },
  { label: "550-700 万", value: "550to700" },
  { label: "700 万以上", value: "over700" },
];

const roomOptions: Array<{ label: string; value: RoomFilter }> = [
  { label: "不限", value: "all" },
  { label: "两室", value: "2" },
  { label: "三室", value: "3" },
  { label: "四室", value: "4" },
];

function getAreaValue(layout: Layout) {
  return Number.parseInt(layout.area, 10);
}

function getPriceRange(layout: Layout) {
  const [min = 0, max = min] = layout.priceRange.match(/\d+/g)?.map(Number) ?? [];
  return { min, max };
}

function getRoomCount(layout: Layout) {
  if (layout.rooms.includes("两室")) return "2";
  if (layout.rooms.includes("三室")) return "3";
  if (layout.rooms.includes("四室")) return "4";
  return "all";
}

function matchesArea(layout: Layout, filter: AreaFilter) {
  const area = getAreaValue(layout);

  if (filter === "compact") return area <= 85;
  if (filter === "comfort") return area >= 86 && area <= 105;
  if (filter === "large") return area >= 106;
  return true;
}

function matchesPrice(layout: Layout, filter: PriceFilter) {
  const { min, max } = getPriceRange(layout);

  if (filter === "under550") return min < 550;
  if (filter === "550to700") return min <= 700 && max >= 550;
  if (filter === "over700") return max > 700;
  return true;
}

export function HomePage() {
  const { buildings, communities, decorStyles, layouts, notice, source } = useHouseData();
  const [areaFilter, setAreaFilter] = useState<AreaFilter>("all");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [roomFilter, setRoomFilter] = useState<RoomFilter>("all");

  const filteredLayouts = useMemo(
    () =>
      layouts
        .map((layout) => {
          const building = buildings.find((item) => item.id === layout.buildingId);
          const community = building
            ? communities.find((item) => item.id === building.communityId)
            : undefined;

          return { layout, building, community };
        })
        .filter(({ layout }) => matchesArea(layout, areaFilter))
        .filter(({ layout }) => matchesPrice(layout, priceFilter))
        .filter(({ layout }) => roomFilter === "all" || getRoomCount(layout) === roomFilter),
    [areaFilter, buildings, communities, layouts, priceFilter, roomFilter],
  );

  const recommendedCommunity = communities[0];
  const recommendedLayout = layouts[0];

  return (
    <div className="page-flow">
      <section className="home-hero">
        <div className="home-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">地图找房 · 3D 看户型</span>
            {source === "demo" ? <SimulationBadge /> : null}
            <span className="data-source-badge">{getDataSourceLabel(source)}</span>
          </div>
          <h1>先在线上看清楚，再决定要不要线下看房</h1>
          <p>
            从小区位置、周边配套、户型信息到 3D 示意空间，这个 Demo 帮普通买房用户快速完成第一轮筛选。
          </p>
          {notice ? <p className="data-notice">{notice}</p> : null}
          <div className="hero-actions">
            <Link className="button button-primary" to={`/communities/${recommendedCommunity.id}`}>
              <Search size={18} aria-hidden="true" />
              开始看房
            </Link>
            <Link className="button button-secondary" to={`/vr/${recommendedLayout.id}`}>
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
              <strong>{layouts.length}</strong>
              个户型
            </span>
            <span>
              <strong>{decorStyles.length}</strong>
              种装修风格
            </span>
          </div>
        </div>

        <div className="home-visual" aria-label="明亮住宅看房示意">
          <div className="hero-photo" />
          <div className="hero-visual-card">
            <span>今日推荐</span>
            <strong>{recommendedCommunity.name}</strong>
            <small>{recommendedCommunity.district} · {recommendedCommunity.priceRange}</small>
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
        <AmapCommunityMap communities={communities} />
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">快速筛选</span>
          <h2>按预算和空间先缩小范围</h2>
        </div>
        <div className="filter-panel" aria-label="户型快速筛选">
          <div className="filter-groups">
            <div className="filter-group">
              <span>面积</span>
              <div className="filter-options" role="group" aria-label="按面积筛选">
                {areaOptions.map((option) => (
                  <button
                    className={`filter-chip ${areaFilter === option.value ? "active" : ""}`}
                    type="button"
                    aria-pressed={areaFilter === option.value}
                    onClick={() => setAreaFilter(option.value)}
                    key={option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span>总价</span>
              <div className="filter-options" role="group" aria-label="按总价筛选">
                {priceOptions.map((option) => (
                  <button
                    className={`filter-chip ${priceFilter === option.value ? "active" : ""}`}
                    type="button"
                    aria-pressed={priceFilter === option.value}
                    onClick={() => setPriceFilter(option.value)}
                    key={option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="filter-group">
              <span>房间数</span>
              <div className="filter-options" role="group" aria-label="按房间数筛选">
                {roomOptions.map((option) => (
                  <button
                    className={`filter-chip ${roomFilter === option.value ? "active" : ""}`}
                    type="button"
                    aria-pressed={roomFilter === option.value}
                    onClick={() => setRoomFilter(option.value)}
                    key={option.value}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="filter-summary">
            <strong>找到 {filteredLayouts.length} 个匹配户型</strong>
            <span>结果会随筛选条件即时更新，方便先挑出值得细看的户型。</span>
          </div>

          {filteredLayouts.length > 0 ? (
            <div className="quick-layout-grid">
              {filteredLayouts.map(({ layout, building, community }) => (
                <article className="quick-layout-card" key={layout.id}>
                  <div>
                    <span className="card-kicker">{community?.name ?? "示意小区"}</span>
                    <h3>{layout.name}</h3>
                    <p>{building?.name ?? "示意楼盘"} · {layout.thumbnail}</p>
                  </div>
                  <div className="meta-grid">
                    <span>{layout.area}</span>
                    <span>{layout.priceRange}</span>
                    <span>{layout.rooms}</span>
                    <span>{layout.orientation}</span>
                  </div>
                  <div className="card-actions">
                    <Link className="button button-primary" to={`/layouts/${layout.id}`}>
                      查看详情
                      <ArrowRight size={18} aria-hidden="true" />
                    </Link>
                    <Link className="button button-secondary" to={`/vr/${layout.id}`}>
                      <Cuboid size={18} aria-hidden="true" />
                      看 3D
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="filter-empty">
              暂时没有符合条件的户型，可以放宽面积、总价或房间数再试试。
            </div>
          )}
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
                <span className="card-kicker">小区推荐</span>
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
