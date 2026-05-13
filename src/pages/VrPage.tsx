import { ArrowLeft, BedDouble, ChefHat, Sofa } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { FavoriteButton } from "../components/FavoriteButton";
import { PageHeader } from "../components/PageHeader";
import { ThreeRoomViewer } from "../components/ThreeRoomViewer";
import { decorStyles } from "../data/demoData";
import type { StyleKey } from "../types";
import { getLayoutContext } from "../utils/dataLookup";

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
  const { layout, building, community } = getLayoutContext(layoutId ?? "");
  const [activeStyleKey, setActiveStyleKey] = useState<StyleKey>("modern");
  const [activeRoom, setActiveRoom] = useState<RoomKey>("living");

  const activeStyle = useMemo(
    () => decorStyles.find((style) => style.key === activeStyleKey) ?? decorStyles[0],
    [activeStyleKey],
  );
  const activeRoomLabel = roomOptions.find((room) => room.key === activeRoom)?.label ?? "客厅";

  if (!layout || !building || !community) {
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
