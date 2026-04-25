import { featureCollection } from "@turf/turf";

// Point Survey: matches Django PointSurvey model
export type SurveyPoint = {
  id: number;
  latitude: number;
  longitude: number;
  notes: string;
  photo_uri?: string;
  updated_at?: string;
};

// Polygon Survey: matches Django PolygonSurvey model
export type SurveyPolygon = {
  id: number;
  coords: { latitude: number; longitude: number }[];
  notes?: string;
  photo_uri?: string;
  updated_at?: string;
};

// Center Point Survey: matches Django CenterPointSurvey model
export type CenterPointSurvey = {
  photo_uri?: string;
  id: number;
  latitude: number;
  longitude: number;
  spacing: number;
  num_trees: number;
  estimated_area: number;
  notes?: string;
  updated_at?: string;
};

// Export helpers to GeoJSON
export const exportPointsToGeoJSON = (points: SurveyPoint[]) => ({
  type: featureCollection,
  features: points.map((point) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [point.longitude, point.latitude],
    },
    properties: {
      id: point.id,
      notes: point.notes,
      photo_uri: point.photo_uri,
    },
  })),
});

export const exportPolygonsToGeoJSON = (polygons: SurveyPolygon[]) => ({
  type: featureCollection,
  features: polygons.map((polygon) => ({
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [polygon.coords.map((c) => [c.longitude, c.latitude])],
    },
    properties: {
      id: polygon.id,
      notes: polygon.notes,
      photo_uri: polygon.photo_uri,
    },
  })),
});

export const exportCenterPointsToGeoJSON = (surveys: CenterPointSurvey[]) => ({
  type: featureCollection,
  features: surveys.map((survey) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [survey.longitude, survey.latitude],
    },
    properties: {
      id: survey.id,
      spacing: survey.spacing,
      num_trees: survey.num_trees,
      estimated_area: survey.estimated_area,
      notes: survey.notes,
      photo_uri: survey.photo_uri,
    },
  })),
});
