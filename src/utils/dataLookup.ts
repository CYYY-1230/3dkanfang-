import { buildings, communities, layouts } from "../data/demoData";

export function getCommunity(id?: string) {
  return communities.find((community) => community.id === id);
}

export function getBuilding(id?: string) {
  return buildings.find((building) => building.id === id);
}

export function getLayout(id?: string) {
  return layouts.find((layout) => layout.id === id);
}

export function getBuildingsByCommunity(communityId: string) {
  return buildings.filter((building) => building.communityId === communityId);
}

export function getLayoutsByBuilding(buildingId: string) {
  return layouts.filter((layout) => layout.buildingId === buildingId);
}

export function getLayoutContext(layoutId: string) {
  const layout = getLayout(layoutId);
  const building = layout ? getBuilding(layout.buildingId) : undefined;
  const community = building ? getCommunity(building.communityId) : undefined;

  return { layout, building, community };
}
