import { createContext, type ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured } from "../lib/supabase";
import { demoHouseData, loadHouseData, type HouseData, type HouseDataSource } from "../services/houseData";
import type { Building, Community, Layout } from "../types";

type HouseDataStatus = "loading" | "ready";

type LayoutContext = {
  layout?: Layout;
  building?: Building;
  community?: Community;
};

type HouseDataContextValue = HouseData & {
  status: HouseDataStatus;
  getCommunity: (id?: string) => Community | undefined;
  getBuilding: (id?: string) => Building | undefined;
  getLayout: (id?: string) => Layout | undefined;
  getBuildingsByCommunity: (communityId: string) => Building[];
  getLayoutsByBuilding: (buildingId: string) => Layout[];
  getLayoutContext: (layoutId: string) => LayoutContext;
};

const HouseDataContext = createContext<HouseDataContextValue | undefined>(undefined);

function createContextValue(data: HouseData, status: HouseDataStatus): HouseDataContextValue {
  const getCommunity = (id?: string) => data.communities.find((community) => community.id === id);
  const getBuilding = (id?: string) => data.buildings.find((building) => building.id === id);
  const getLayout = (id?: string) => data.layouts.find((layout) => layout.id === id);

  const getBuildingsByCommunity = (communityId: string) =>
    data.buildings.filter((building) => building.communityId === communityId);

  const getLayoutsByBuilding = (buildingId: string) =>
    data.layouts.filter((layout) => layout.buildingId === buildingId);

  const getLayoutContext = (layoutId: string) => {
    const layout = getLayout(layoutId);
    const building = layout ? getBuilding(layout.buildingId) : undefined;
    const community = building ? getCommunity(building.communityId) : undefined;

    return { layout, building, community };
  };

  return {
    ...data,
    status,
    getCommunity,
    getBuilding,
    getLayout,
    getBuildingsByCommunity,
    getLayoutsByBuilding,
    getLayoutContext,
  };
}

export function HouseDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<HouseData>(demoHouseData);
  const [status, setStatus] = useState<HouseDataStatus>(
    isSupabaseConfigured ? "loading" : "ready",
  );

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      const nextData = await loadHouseData();

      if (!isMounted) return;

      setData(nextData);
      setStatus("ready");
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const value = useMemo(() => createContextValue(data, status), [data, status]);

  return <HouseDataContext.Provider value={value}>{children}</HouseDataContext.Provider>;
}

export function useHouseData() {
  const value = useContext(HouseDataContext);

  if (!value) {
    throw new Error("useHouseData must be used inside HouseDataProvider");
  }

  return value;
}

export function getDataSourceLabel(source: HouseDataSource) {
  return source === "supabase" ? "云端数据" : "示例数据";
}
