import type { FloorPlanRoom } from "../types";

type FloorPlanProps = {
  rooms: FloorPlanRoom[];
  compact?: boolean;
};

export function FloorPlan({ rooms, compact = false }: FloorPlanProps) {
  return (
    <div className={`floor-plan ${compact ? "floor-plan-compact" : ""}`} aria-label="户型图示意">
      {rooms.map((room) => (
        <span
          className="floor-room"
          key={room.label}
          style={{
            left: `${room.x}%`,
            top: `${room.y}%`,
            width: `${room.width}%`,
            height: `${room.height}%`,
          }}
        >
          {room.label}
        </span>
      ))}
    </div>
  );
}
