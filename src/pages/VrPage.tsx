import { ArrowLeft, BedDouble, ChefHat, Hand, MousePointer2, Palette, Sofa } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FavoriteButton } from "../components/FavoriteButton";
import { PageHeader } from "../components/PageHeader";
import { ThreeRoomViewer } from "../components/ThreeRoomViewer";
import { useHouseData } from "../context/HouseDataContext";
import type { StyleKey } from "../types";

type RoomKey = "living" | "bedroom" | "kitchen";

type VrPageProps = {
  isFavorite: (layoutId: string) => boolean;
  onToggleFavorite: (layoutId: string) => void;
};

const roomOptions: Array<{ key: RoomKey; label: string; icon: typeof Sofa }> = [
  { key: "living", label: "客厅", icon: Sofa },
  { key: "bedroom", label: "卧室", icon: BedDouble },
  { key: "kitchen", label: "厨房", icon: ChefHat },
];

export function VrPage({ isFavorite, onToggleFavorite }: VrPageProps) {
  const { layoutId } = useParams();
  const { decorStyles, getLayoutContext, status } = useHouseData();
  const { layout, building, community } = getLayoutContext(layoutId ?? "");
  const [activeStyleKey, setActiveStyleKey] = useState<StyleKey>("modern");
  const [activeRoom, setActiveRoom] = useState<RoomKey>("living");

  const activeStyle = useMemo(
    () => decorStyles.find((style) => style.key === activeStyleKey) ?? decorStyles[0],
    [activeStyleKey],
  );
  const activeRoomLabel = roomOptions.find((room) => room.key === activeRoom)?.label ?? "客厅";

  if (!layout || !building || !community) {
    if (status === "loading") {
      return (
        <div className="page-flow">
          <section className="empty-state">
            <h2>正在准备 3D 看房</h2>
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
        backTo={`/layouts/${layout.id}`}
        eyebrow={`${community.name} · ${layout.area}`}
        title={`${layout.name} 3D/VR 看房`}
        description={activeStyle.description}
        actions={
          <FavoriteButton
            active={isFavorite(layout.id)}
            onClick={() => onToggleFavorite(layout.id)}
            variant="primary"
          />
        }
      />

      <section className="vr-layout">
        <div className="vr-stage">
          <div className="vr-status">
            <span>{activeRoomLabel}</span>
            <strong>{activeStyle.name}</strong>
          </div>
          <div className="vr-help-tips" aria-label="3D 看房操作提示">
            <span>
              <Hand size={16} aria-hidden="true" />
              拖动查看房间
            </span>
            <span>
              <MousePointer2 size={16} aria-hidden="true" />
              点击切换客厅/卧室/厨房
            </span>
            <span>
              <Palette size={16} aria-hidden="true" />
              右侧可换装修风格
            </span>
          </div>
          <ThreeRoomViewer decorStyle={activeStyle} activeRoom={activeRoom} />
          <div className="vr-toolbar" aria-label="房间导航">
            {roomOptions.map((room) => {
              const Icon = room.icon;
              return (
                <button
                  className={`segmented-button ${activeRoom === room.key ? "active" : ""}`}
                  type="button"
                  onClick={() => setActiveRoom(room.key)}
                  key={room.key}
                >
                  <Icon size={18} aria-hidden="true" />
                  {room.label}
                </button>
              );
            })}
          </div>
        </div>

        <aside className="vr-side-panel">
          <div>
            <span className="card-kicker">当前方案</span>
            <h2>装修风格</h2>
          </div>
          <div className="style-options">
            {decorStyles.map((style) => (
              <button
                className={`style-option ${activeStyleKey === style.key ? "active" : ""}`}
                type="button"
                onClick={() => setActiveStyleKey(style.key)}
                key={style.key}
              >
                <span
                  className="style-swatch"
                  style={{ background: `linear-gradient(135deg, ${style.wall}, ${style.accent})` }}
                />
                <span>
                  <strong>{style.name}</strong>
                  <small>{style.description}</small>
                </span>
              </button>
            ))}
          </div>
          <Link className="button button-secondary button-wide" to={`/layouts/${layout.id}`}>
            <ArrowLeft size={18} aria-hidden="true" />
            返回户型详情
          </Link>
        </aside>
      </section>
    </div>
  );
}
