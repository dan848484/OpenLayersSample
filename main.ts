import "./style.css";
import { Feature, Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import Point from "ol/geom/Point";
import Style from "ol/style/Style";
import Icon from "ol/style/Icon";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import LinearRing from "ol/geom/LinearRing";
import Fill from "ol/style/Fill";
import ImageStatic from "ol/source/ImageStatic";
import VectorImageLayer from "ol/layer/VectorImage";
import Polygon from "ol/geom/Polygon";
import MultiPolygon from "ol/geom/MultiPolygon";
import Projection from "ol/proj/Projection";
import { fromLonLat } from "ol/src/proj";
import { disneyImage } from "./imageData";
import { Image, Tile } from "ol/layer";
import { transformExtent } from "ol/proj/transforms";
import XYZ from "ol/source/XYZ";

//佐渡島を囲む座標
const coordinates = [
  // 経度、緯度の順で定義
  //【注意】最初と最後の座標は同じにならないといけない
  [138.247243, 38.317245],
  [138.184912, 38.173751],
  [138.0778591227916, 37.830986409949396],
  [138.3828797139343, 37.74678185645601],
  [138.9284682246435, 38.07523995472225],
  [138.3828797139343, 38.77523995472225],
  [138.247243, 38.317245],
];

//東京ディズニーリゾートを取り囲む矩形
const disneyCoordinates = [
  [139.86605288747617, 35.63996853858424],
  [139.86604639720952, 35.61776367832307],
  [139.90449404938747, 35.61769049507307],
  [139.90446611619558, 35.639954583440804],
  [139.86605288747617, 35.63996853858424],
];

//佐渡島を囲む多角形
const polyFeature = new Feature({
  geometry: new Polygon([coordinates]),
});

//ディズニーを囲む多角形
const disneyFeature = new Feature({
  geometry: new Polygon([disneyCoordinates]),
});

//経度と緯度をwebメルカルトへ変換
polyFeature.getGeometry().transform("EPSG:4326", "EPSG:3857");
disneyFeature.getGeometry().transform("EPSG:4326", "EPSG:3857");

//見た目を定義
const styles = new Style({
  fill: new Fill({
    // color: "rgba(0,5,255,0.3)",
  }),
});

const vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [polyFeature, disneyFeature],
  }),
  style: styles,
});

// 画像の範囲  (座標の配列で、[left(左下の座標の経度), bottom(左下の座標の緯度), right(右上の座標の経度), top(右上の座標の緯度)]の順になっている。）
// fromLonLat()で経度緯度をwebメルカルトに変換。
const imageExtent: number[] = fromLonLat([
  139.86604639720952, 35.61776367832307,
]).concat(fromLonLat([139.90446611619558, 35.639954583440804]));

const imageLayer = new Image({
  source: new ImageStatic({
    url: disneyImage,
    projection: new Projection({
      code: "xkcd-image",
      units: "pixels",
    }),
    imageExtent: imageExtent,
  }),
  className: "disney",
});

//作ったwebメルカルト地図
var mapExtent = fromLonLat([139.865957, 35.617521]).concat(
  fromLonLat([139.904628, 35.64006])
);

var mapMinZoom = 13;
var mapMaxZoom = 16;
var layer = new Tile({
  extent: mapExtent,
  source: new XYZ({
    url: "./maps/{z}/{x}/{y}.png",
    tilePixelRatio: 1.0,
    minZoom: mapMinZoom,
    maxZoom: mapMaxZoom,
  }),
});

//マップの設定
const map = new Map({
  target: "map",
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    layer,
  ],
  view: new View({
    center: fromLonLat([139.86605288747617, 35.63996853858424]),
    zoom: 10,
  }),
});

//クリックイベント
map.on("click", (e) => {
  map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
    console.log(feature);
  });
});
