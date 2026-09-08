import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function LiveMap({
  trucks = [],
  points = [],
  depot = null,
  routes = [],
  trafficZones = [],
  selectedTruckId = null,
  highlightCitizenPos = null,
  onPointClick = null,
  onTruckClick = null,
  height = '500px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layersRef = useRef({
    markers: L.layerGroup(),
    routes: L.layerGroup(),
    traffic: L.layerGroup(),
  });

  // Initialize Leaflet Map once
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Centered around Ho Chi Minh City District 1
    const map = L.map(mapContainerRef.current, {
      center: [10.7765, 106.7000],
      zoom: 14,
      zoomControl: true,
    });

    // Dark Matter CartoDB Tiles for high-tech aesthetic
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    // Add layer groups
    layersRef.current.routes.addTo(map);
    layersRef.current.traffic.addTo(map);
    layersRef.current.markers.addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Layers when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { markers, routes: routeLayer, traffic: trafficLayer } = layersRef.current;
    markers.clearLayers();
    routeLayer.clearLayers();
    trafficLayer.clearLayers();

    const bounds = L.latLngBounds();

    // 1. Render Traffic Zones
    trafficZones.forEach((zone) => {
      if (zone.lat && zone.lng) {
        const trafficCircle = L.circle([zone.lat, zone.lng], {
          radius: (zone.radiusKm || 0.6) * 1000,
          color: zone.severity === 'HEAVY' ? '#ef4444' : '#f59e0b',
          fillColor: zone.severity === 'HEAVY' ? '#ef4444' : '#f59e0b',
          fillOpacity: 0.25,
          weight: 2,
          dashArray: '4, 4',
        });
        trafficCircle.bindPopup(`
          <div style="font-family: inherit; font-size: 13px; line-height: 1.4;">
            <b style="color: #ef4444;">⚠️ ${zone.name}</b><br/>
            <span>Mức độ ùn tắc: <b>${zone.severity}</b></span><br/>
            <span>Ước tính trễ: <b>+${zone.delayMins} phút</b></span>
          </div>
        `);
        trafficLayer.addLayer(trafficCircle);
      }
    });

    // 2. Render Routes (Polylines following real road network)
    const routeColors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
    routes.forEach((route, idx) => {
      const latlngs = (route.roadGeometry && route.roadGeometry.length > 2)
        ? route.roadGeometry
        : (route.waypoints || []).map((wp) => [wp.lat, wp.lng]);

      if (latlngs.length > 1) {
        const color = routeColors[idx % routeColors.length];
        const isSelected = selectedTruckId && route.truckId === selectedTruckId;

        const polyline = L.polyline(latlngs, {
          color: isSelected ? '#10b981' : color,
          weight: isSelected ? 5 : 4,
          opacity: isSelected ? 0.95 : 0.8,
          lineCap: 'round',
          lineJoin: 'round',
        });

        polyline.bindPopup(`
          <div style="font-family: inherit; font-size: 13px;">
            <b style="color: ${color};">🚛 Tuyến xe: ${route.truckPlate} (${route.driverName})</b><br/>
            <span>Khoảng cách: <b>${route.totalDistanceKm} km</b> | Thời gian: <b>${route.totalTimeMinutes} phút</b></span><br/>
            <span>Tải trọng gom: <b>${route.totalLoadKg} / ${route.truckCapacityKg} kg (${route.fillPercentage}%)</b></span>
          </div>
        `);

        routeLayer.addLayer(polyline);
      }
    });

    // 3. Render Depot Marker
    if (depot && depot.lat && depot.lng) {
      const depotIcon = L.divIcon({
        className: 'custom-depot-marker',
        html: `
          <div style="background: #6366f1; color: white; width: 34px; height: 34px; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(99,102,241,0.5); border: 2px solid #ffffff;">
            🏢
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const depotMarker = L.marker([depot.lat, depot.lng], { icon: depotIcon });
      depotMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <b style="color: #6366f1;">🏢 ${depot.name}</b><br/>
          <span style="color: #94a3b8;">${depot.address}</span><br/>
          <span style="display: inline-block; margin-top: 4px; padding: 2px 6px; background: rgba(99,102,241,0.2); color: #818cf8; border-radius: 4px; font-size: 11px;">Điểm Xuất Phát & Bãi Đổ Rác (VRP Depot)</span>
        </div>
      `);
      markers.addLayer(depotMarker);
      bounds.extend([depot.lat, depot.lng]);
    }

    // 4. Render Collection Points (Citizens & Businesses)
    points.forEach((point) => {
      if (!point.lat || !point.lng) return;

      const isCommercial = point.type === 'COMMERCIAL';
      const isCollected = point.status === 'COLLECTED';
      const isSkipped = point.status === 'SKIPPED';

      let bgColor = isCommercial ? '#f59e0b' : '#10b981';
      let iconEmoji = isCommercial ? '🏨' : '🏠';
      if (point.category === 'RESTAURANT') iconEmoji = '🍜';
      if (point.category === 'MALL') iconEmoji = '🛍️';

      if (isCollected) {
        bgColor = '#64748b';
        iconEmoji = '✅';
      } else if (isSkipped) {
        bgColor = '#ef4444';
        iconEmoji = '❌';
      }

      const pointIcon = L.divIcon({
        className: 'custom-point-marker',
        html: `
          <div style="background: ${bgColor}; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 3px 8px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
            ${iconEmoji}
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([point.lat, point.lng], { icon: pointIcon });
      marker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; min-width: 180px;">
          <b style="color: ${bgColor};">${iconEmoji} ${point.name}</b><br/>
          <span style="color: #64748b; font-size: 11px;">${point.address}</span>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 6px 0;" />
          <div>Lượng rác: <b>${point.wasteAmountKg} kg</b> (${point.wasteType || 'Sinh hoạt'})</div>
          <div>Giờ hẹn: <b>${point.preferredTime || '10:00'}</b></div>
          <div>Trạng thái: <b style="color: ${isCollected ? '#10b981' : isSkipped ? '#ef4444' : '#f59e0b'}">${point.status || 'Chờ thu gom'}</b></div>
          <div style="margin-top: 4px; font-size: 11px; color: #94a3b8;">📞 ${point.contactPhone || 'N/A'}</div>
        </div>
      `);

      if (onPointClick) {
        marker.on('click', () => onPointClick(point));
      }

      markers.addLayer(marker);
      bounds.extend([point.lat, point.lng]);
    });

    // 5. Highlight Specific Citizen Pin if provided
    if (highlightCitizenPos && highlightCitizenPos.lat && highlightCitizenPos.lng) {
      const userPinIcon = L.divIcon({
        className: 'user-pin-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 44px; height: 44px; border-radius: 50%; background: rgba(16,185,129,0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="background: #10b981; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; border: 3px solid white; box-shadow: 0 4px 14px rgba(16,185,129,0.6); z-index: 10;">
              📍
            </div>
          </div>
        `,
        iconSize: [44, 44],
        iconAnchor: [22, 22],
      });

      const userMarker = L.marker([highlightCitizenPos.lat, highlightCitizenPos.lng], { icon: userPinIcon });
      userMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px;">
          <b style="color: #10b981;">📍 Vị Trí Của Bạn (Địa Điểm Gom Rác)</b><br/>
          <span>${highlightCitizenPos.address || 'Địa chỉ hộ gia đình / dịch vụ'}</span>
        </div>
      `);
      markers.addLayer(userMarker);
      bounds.extend([highlightCitizenPos.lat, highlightCitizenPos.lng]);
    }

    // 6. Render Trucks with live animation & pulses
    trucks.forEach((truck) => {
      if (!truck.lat || !truck.lng) return;

      const isSelected = selectedTruckId && truck.id === selectedTruckId;
      const isDelayed = truck.isDelayed;

      const truckIcon = L.divIcon({
        className: 'truck-marker',
        html: `
          <div style="position: relative; display: flex; align-items: center; justify-content: center;">
            <div style="position: absolute; width: 38px; height: 38px; border-radius: 50%; background: ${isDelayed ? 'rgba(239, 68, 68, 0.4)' : isSelected ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)'}; animation: marker-pulse 2s infinite;"></div>
            <div style="background: ${isDelayed ? '#ef4444' : '#0284c7'}; color: white; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; border: 2px solid #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.4); z-index: 5;">
              🚛
            </div>
          </div>
        `,
        iconSize: [38, 38],
        iconAnchor: [19, 19],
      });

      const truckMarker = L.marker([truck.lat, truck.lng], { icon: truckIcon });
      truckMarker.bindPopup(`
        <div style="font-family: inherit; font-size: 13px; min-width: 200px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <b style="color: #0284c7; font-size: 14px;">🚛 ${truck.licensePlate}</b>
            <span style="font-size: 11px; padding: 2px 6px; border-radius: 4px; background: ${isDelayed ? '#fee2e2; color: #b91c1c' : '#dcfce7; color: #15803d'}">
              ${isDelayed ? 'Bị Trễ Giờ' : 'Đang Thu Gom'}
            </span>
          </div>
          <div style="color: #64748b; font-size: 12px;">Tài xế: <b>${truck.driverName}</b> (${truck.driverPhone})</div>
          <hr style="border-color: rgba(255,255,255,0.1); margin: 6px 0;" />
          <div>Tải trọng: <b>${truck.currentLoadKg} / ${truck.capacityKg} kg</b> (${Math.round((truck.currentLoadKg / truck.capacityKg) * 100)}%)</div>
          <div>Vận tốc: <b>${truck.speedKmH} km/h</b> | Nhiên liệu: <b>${truck.fuelLevel || 80}%</b></div>
          <div style="margin-top: 4px; color: #0284c7;">Tiếp theo: <b>${truck.nextStopName || 'Trạm trung chuyển'}</b></div>
          ${truck.etaToNextMins ? `<div style="font-size: 11px; color: #10b981;">ETA đến điểm kế: <b>~${truck.etaToNextMins} phút (${truck.distToNextKm} km)</b></div>` : ''}
          ${isDelayed && truck.delayReason ? `<div style="margin-top: 4px; font-size: 11px; color: #ef4444; background: rgba(239,68,68,0.1); padding: 4px; border-radius: 4px;">⚠️ ${truck.delayReason}</div>` : ''}
        </div>
      `);

      if (onTruckClick) {
        truckMarker.on('click', () => onTruckClick(truck));
      }

      markers.addLayer(truckMarker);
      bounds.extend([truck.lat, truck.lng]);
    });

    // Auto fit bounds if points exist
    if (bounds.isValid() && (!mapInstanceRef.current._hasInitialFit || selectedTruckId)) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
      mapInstanceRef.current._hasInitialFit = true;
    }
  }, [trucks, points, depot, routes, trafficZones, selectedTruckId, highlightCitizenPos]);

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-700/60 shadow-xl" style={{ height }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Map Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700/60 text-xs flex flex-wrap items-center gap-3 shadow-lg">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-eco-500 inline-block"></span>
          <span className="text-slate-200">Hộ dân (Nhà riêng)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
          <span className="text-slate-200">Khu dịch vụ (Khách sạn/Quán)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-indigo-500 inline-block"></span>
          <span className="text-slate-200">Trạm EcoDepot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-sky-500 inline-block"></span>
          <span className="text-slate-200">Xe thu gom (GPS)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/50 border border-red-500 inline-block"></span>
          <span className="text-slate-200">Ùn tắc giao thông</span>
        </div>
      </div>
    </div>
  );
}
