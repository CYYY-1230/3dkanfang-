import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { SimulationBadge } from "./SimulationBadge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  backTo?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, backTo, actions }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="page-header-main">
        {backTo ? (
          <Link to={backTo} className="back-link">
            <ChevronLeft size={18} aria-hidden="true" />
            返回
          </Link>
        ) : null}
        <div className="eyebrow-row">
          {eyebrow ? <span className="eyebrow">{eyebrow}</span> : null}
          <SimulationBadge />
        </div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </section>
  );
}
