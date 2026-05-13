import { load as loadAmap } from "@amap/amap-jsapi-loader";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Community } from "../types";

type AmapCommunityMapProps = {
  communities: Community[];
};

type MapStatus = "loading" | "ready" | "error";

const amapKey = import.meta.env.VITE_AMAP_KEY;
const amapSecurityCode = import.meta.env.VITE_AMAP_SECURITY_CODE;

export function AmapCommunityMap({ communities }: AmapCommunityMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<MapStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("地图正在加载，请稍等。");
  const navigate = useNavigate();

  const center = useMemo<[number, number]>(() => {
    if (communities.length === 0) return [120.155, 30.274];

    const total = communities.reduce(
      (sum, community) => ({
        lng: sum.lng + community.lngLat[0],
        lat: sum.lat + community.lngLat[1],
      }),
      { lng: 0, lat: 0 },
    );

    return [total.lng / communities.length, total.lat / communities.length];
  }, [communities]);

  useEffect(() => {
    let map: any;
    let isMounted = true;

    if (!mapRef.current) return undefined;

    if (!amapKey || !amapSecurityCode) {
      setStatus("error");
      setErrorMessage("缺少高德地图 Key 或安全密钥，请先检查本地配置。");
      return undefined;
    }

    window._AMapSecurityConfig = {
      securityJsCode: amapSecurityCode,
    };

    setStatus("loading");
    setErrorMessage("地图正在加载，请稍等。");

    loadAmap({
      key: amapKey,
      version: "2.0",
      plugins: ["AMap.Scale", "AMap.ToolBar"],
    })
      .then((AMap) => {
        if (!isMounted || !mapRef.current) return;

        map = new AMap.Map(mapRef.current, {
          center,
          mapStyle: "amap://styles/normal",
          resizeEnable: true,
          viewMode: "2D",
          zoom: 12,
        });

        map.addControl(new AMap.Scale());
        map.addControl(
          new AMap.ToolBar({
            position: {
              right: "16px",
              top: "16px",
            },
          }),
        );

        const infoWindow = new AMap.InfoWindow({
          anchor: "bottom-center",
          offset: new AMap.Pixel(0, -42),
        });

        const markers = communities.map((community) => {
          const markerContent = document.createElement("button");
          markerContent.type = "button";
          markerContent.className = "amap-community-marker";
          markerContent.setAttribute("aria-label", `查看${community.name}`);

          const markerName = document.createElement("span");
          markerName.textContent = community.name;
          markerContent.append(markerName);

          const marker = new AMap.Marker({
            anchor: "bottom-center",
            content: markerContent,
            position: community.lngLat,
            title: community.name,
          });

          const openInfo = () => {
            const content = document.createElement("div");
            content.className = "amap-info-card";

            const kicker = document.createElement("span");
            kicker.className = "card-kicker";
            kicker.textContent = community.district;

            const title = document.createElement("strong");
            title.textContent = community.name;

            const address = document.createElement("small");
            address.textContent = community.address;

            const price = document.createElement("p");
            price.textContent = `${community.averagePrice} · ${community.priceRange}`;

            const detailButton = document.createElement("button");
            detailButton.type = "button";
            detailButton.className = "amap-info-button";
            detailButton.textContent = "查看详情";
            detailButton.addEventListener("click", () => {
              navigate(`/communities/${community.id}`);
            });

            content.append(kicker, title, address, price, detailButton);
            infoWindow.setContent(content);
            infoWindow.open(map, community.lngLat);
          };

          marker.on("click", openInfo);
          markerContent.addEventListener("click", openInfo);

          return marker;
        });

        map.add(markers);

        if (markers.length > 0) {
          map.setFitView(markers, false, [64, 64, 64, 64], 13);
        }

        setStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setStatus("error");
        setErrorMessage("高德地图加载失败，请检查 Key、安全密钥或网络。");
      });

    return () => {
      isMounted = false;
      if (map) {
        map.destroy();
      }
    };
  }, [center, communities, navigate]);

  return (
    <div className="map-panel map-panel-real" aria-label="高德地图找房">
      <div className="amap-container" ref={mapRef} />
      {status !== "ready" && (
        <div className={`map-state map-state-${status}`} role={status === "error" ? "alert" : "status"}>
          <strong>{status === "error" ? "地图暂时没有打开" : "正在打开真实地图"}</strong>
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
