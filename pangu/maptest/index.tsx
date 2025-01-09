import CPanguMap from "..";
import * as React from "react";
import { memo, useState, useRef } from "react";

const MapTest = memo(() => {
  const firstRenderRef = useRef(true);
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    const pgMap = new CPanguMap({});
    pgMap.init({
      plate: { open: true, number: 6, width: 300, height: 150 },
    });
  }, []);
  return <div className="map-test"></div>;
});
export default MapTest;
