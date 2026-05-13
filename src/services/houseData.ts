import { buildings, communities, decorStyles, layouts } from "../data/demoData";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import type { Amenity, Building, Community, DecorStyle, FloorPlanRoom, Layout, StyleKey } from "../types";

export type HouseDataSource = "demo" | "supabase";

export type HouseData = {
  communities: Community[];
  buildings: Building[];
  layouts: Layout[];
  decorStyles: DecorStyle[];
  source: HouseDataSource;
  notice?: string;
};

type CommunityRow = {
  id: string;
  name: string;
  district: string;
  address: string;
  average_price: string;
  price_range: string;
  intro: string;
  map_x: number | string;
  map_y: number | string;
  lng: number | string;
  lat: number | string;
  amenities: Amenity[];
};

type BuildingRow = {
  id: string;
  community_id: string;
  name: string;
  cover: string;
  intro: string;
  main_layouts: string;
  price_range: string;
};

type LayoutRow = {
  id: string;
  building_id: string;
  name: string;
  area: string;
  rooms: string;
  orientation: string;
  price_range: string;
  thumbnail: string;
  suitable_for: string;
  highlights: string[];
  floor_plan: FloorPlanRoom[];
};

type DecorStyleRow = {
  key: string;
  name: string;
  description: string;
  wall: string;
  floor: string;
  accent: string;
};

export const demoHouseData: HouseData = {
  communities,
  buildings,
  layouts,
  decorStyles,
  source: "demo",
  notice: "还没有填写 Supabase 配置，页面正在使用本地示例数据。",
};

function mapCommunity(row: CommunityRow, allBuildings: BuildingRow[]): Community {
  return {
    id: row.id,
    name: row.name,
    district: row.district,
    address: row.address,
    averagePrice: row.average_price,
    priceRange: row.price_range,
    intro: row.intro,
    mapPosition: {
      x: Number(row.map_x),
      y: Number(row.map_y),
    },
    lngLat: [Number(row.lng), Number(row.lat)],
    amenities: row.amenities,
    buildingIds: allBuildings
      .filter((building) => building.community_id === row.id)
      .map((building) => building.id),
  };
}

function mapBuilding(row: BuildingRow, allLayouts: LayoutRow[]): Building {
  return {
    id: row.id,
    communityId: row.community_id,
    name: row.name,
    cover: row.cover,
    intro: row.intro,
    mainLayouts: row.main_layouts,
    priceRange: row.price_range,
    layoutIds: allLayouts.filter((layout) => layout.building_id === row.id).map((layout) => layout.id),
  };
}

function mapLayout(row: LayoutRow): Layout {
  return {
    id: row.id,
    buildingId: row.building_id,
    name: row.name,
    area: row.area,
    rooms: row.rooms,
    orientation: row.orientation,
    priceRange: row.price_range,
    thumbnail: row.thumbnail,
    suitableFor: row.suitable_for,
    highlights: row.highlights,
    floorPlan: row.floor_plan,
  };
}

function mapDecorStyle(row: DecorStyleRow): DecorStyle {
  return {
    key: row.key as StyleKey,
    name: row.name,
    description: row.description,
    wall: row.wall,
    floor: row.floor,
    accent: row.accent,
  };
}

export async function loadHouseData(): Promise<HouseData> {
  if (!isSupabaseConfigured || !supabase) {
    return demoHouseData;
  }

  const [communityResult, buildingResult, layoutResult, styleResult] = await Promise.all([
    supabase.from("communities").select("*").order("created_at", { ascending: true }),
    supabase.from("buildings").select("*").order("created_at", { ascending: true }),
    supabase.from("layouts").select("*").order("created_at", { ascending: true }),
    supabase.from("decor_styles").select("*").order("key", { ascending: true }),
  ]);

  const error =
    communityResult.error ?? buildingResult.error ?? layoutResult.error ?? styleResult.error;

  if (error) {
    return {
      ...demoHouseData,
      notice: `Supabase 暂时读取失败，页面已自动切回本地示例数据。原因：${error.message}`,
    };
  }

  const communityRows = (communityResult.data ?? []) as CommunityRow[];
  const buildingRows = (buildingResult.data ?? []) as BuildingRow[];
  const layoutRows = (layoutResult.data ?? []) as LayoutRow[];
  const styleRows = (styleResult.data ?? []) as DecorStyleRow[];

  if (communityRows.length === 0 || buildingRows.length === 0 || layoutRows.length === 0) {
    return {
      ...demoHouseData,
      notice: "Supabase 已连接，但还没有完整房源数据，页面先使用本地示例数据。",
    };
  }

  return {
    communities: communityRows.map((row) => mapCommunity(row, buildingRows)),
    buildings: buildingRows.map((row) => mapBuilding(row, layoutRows)),
    layouts: layoutRows.map(mapLayout),
    decorStyles: styleRows.length > 0 ? styleRows.map(mapDecorStyle) : decorStyles,
    source: "supabase",
    notice: "当前房源数据来自 Supabase 云端数据库。",
  };
}
