import { Box, Eye, Ruler } from "lucide-react";
import { Link } from "react-router-dom";
import type { Layout } from "../types";
import { FavoriteButton } from "./FavoriteButton";
import { FloorPlan } from "./FloorPlan";

type LayoutCardProps = {
  layout: Layout;
  isFavorite: boolean;
  onToggleFavorite: (layoutId: string) => void;
};

export function LayoutCard({ layout, isFavorite, onToggleFavorite }: LayoutCardProps) {
  return (
    <article className="layout-card">
      <div className="layout-card-visual">
        <FloorPlan rooms={layout.floorPlan} compact />
      </div>
      <div className="layout-card-body">
        <div>
          <span className="card-kicker">户型</span>
          <h3>{layout.name}</h3>
          <p>{layout.thumbnail}</p>
        </div>
        <div className="meta-grid">
          <span>
            <Ruler size={16} aria-hidden="true" />
            {layout.area}
          </span>
          <span>
            <Box size={16} aria-hidden="true" />
            {layout.rooms}
          </span>
          <span>{layout.orientation}</span>
          <span>{layout.priceRange}</span>
        </div>
        <div className="card-actions">
          <Link className="button button-primary" to={`/layouts/${layout.id}`}>
            <Eye size={18} aria-hidden="true" />
            看详情
          </Link>
          <Link className="button button-secondary" to={`/vr/${layout.id}`}>
            <Box size={18} aria-hidden="true" />
            看 3D
          </Link>
          <FavoriteButton
            active={isFavorite}
            onClick={() => onToggleFavorite(layout.id)}
            label={isFavorite ? "已收藏" : "收藏"}
          />
        </div>
      </div>
    </article>
  );
}
