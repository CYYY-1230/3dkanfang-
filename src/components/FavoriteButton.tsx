import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  active: boolean;
  onClick: () => void;
  label?: string;
  variant?: "primary" | "secondary";
};

export function FavoriteButton({
  active,
  onClick,
  label,
  variant = "secondary",
}: FavoriteButtonProps) {
  return (
    <button
      className={`button ${variant === "primary" ? "button-primary" : "button-secondary"} ${
        active ? "is-favorite" : ""
      }`}
      type="button"
      onClick={onClick}
      aria-pressed={active}
    >
      <Heart size={18} fill={active ? "currentColor" : "none"} aria-hidden="true" />
      {label ?? (active ? "已收藏" : "收藏")}
    </button>
  );
}
