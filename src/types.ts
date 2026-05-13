export type AmenityKind = "交通" | "学校" | "商业" | "医疗" | "公园";

export type Amenity = {
  kind: AmenityKind;
  name: string;
  distance: string;
};

export type Community = {
  id: string;
  name: string;
  district: string;
  address: string;
  averagePrice: string;
  priceRange: string;
  intro: string;
  mapPosition: {
    x: number;
    y: number;
  };
  amenities: Amenity[];
  buildingIds: string[];
};

export type Building = {
  id: string;
  communityId: string;
  name: string;
  cover: string;
  intro: string;
  mainLayouts: string;
  priceRange: string;
  layoutIds: string[];
};

export type Layout = {
  id: string;
  buildingId: string;
  name: string;
  area: string;
  rooms: string;
  orientation: string;
  priceRange: string;
  thumbnail: string;
  suitableFor: string;
  highlights: string[];
  floorPlan: FloorPlanRoom[];
};

export type FloorPlanRoom = {
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

export type StyleKey = "modern" | "cream" | "luxury";

export type DecorStyle = {
  key: StyleKey;
  name: string;
  description: string;
  wall: string;
  floor: string;
  accent: string;
};
