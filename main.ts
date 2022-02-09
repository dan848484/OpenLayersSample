import "./style.css";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import LineString from "ol/geom/LineString";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import Icon from "ol/style/Icon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import BaseLayer from "ol/layer/Base";
import Layer from "ol/layer/Layer";
import LinearRing from "ol/geom/LinearRing";
import Fill from "ol/style/Fill";

const coordinates = [
  // 経度、緯度の順で定義
  [135.49565, 34.702113],
  [137.49565, 34.702113],
  [137.49565, 36.702113],
  [135.49565, 36.702113],
];

const route = new LinearRing(coordinates);
route.transform("EPSG:4326", "EPSG:3857");

const routeCoords = route.getCoordinates();
const routeLength = routeCoords.length;

// const routeFeature = new Feature({
//   type: "route",
//   geometry: route,
// });

// const startMarker = new Feature({
//   type: "icon",
//   geometry: new Point(routeCoords[0]),
// });

// const middleMarker = new Feature({
//   type: "icon",
//   geometry: new Point(routeCoords[1]),
// });

// const endMarker = new Feature({
//   type: "icon",
//   geometry: new Point(routeCoords[routeLength - 1]),
// });

const features: Feature<Point>[] = [];
for (let point of routeCoords) {
  features.push(
    new Feature({
      type: "icon",
      geometry: new Point(point),
    })
  );
}

const styles = new Style({
  image: new Icon({
    anchor: [0.5, 1],
    src: "data:image/png;base64,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", // 適当に置き換えてください
  }),
  fill: new Fill({
    color: "#47d128",
  }),
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: features,
  }),
  style: styles,
});

const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    vectorLayer,
  ],
  view: new View({
    center: [139.76713, 35.680776],
    zoom: 4,
  }),
});
