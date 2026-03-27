import { featureCollection } from "@turf/turf";

export type SurveyPoint = {
    id: string;
    coords: { latitude: number; longitude: number };
    notes?: string;
    photoUri?: string;
}

export type SurveyPolygon = {
    id: string;
    coords: { latitude: number; longitude: number }[];
    notes?: string;
}

export type CenterPointSurvey = {
    id: string;
    center: { latitude: number; longitude: number };
    spacing: number; // spacing between trees in meters
    numTrees: number;
    estimatedArea: number; // estimated area in square meters
    notes?: string;
}

export const exportPointsToGeoJSON = (points: SurveyPoint[]) => ({
    type: featureCollection,
    features: points.map(point => ({
        type: "Feature",
        geometry: { 
            type: "Point", 
            coordinates: [point.coords.longitude, point.coords.latitude] 
        },
        properties: { 
            id: point.id, 
            notes: point.notes, 
            photoUri: point.photoUri }
    }))
})

export const exportPolygonsToGeoJSON = (polygons: SurveyPolygon[]) => ({
    type: featureCollection,
    features: polygons.map(polygon => ({
        type: "Feature",
        geometry: { 
            type: "Polygon", 
            coordinates: [polygon.coords.map(c => [c.longitude, c.latitude])] 
        },
        properties: { 
            id: polygon.id, 
            notes: polygon.notes }
    }))
})

export const exportCenterPointsToGeoJSON = (surveys: CenterPointSurvey[]) => ({
    type: featureCollection,
    features: surveys.map(survey => ({
        type: "Feature",
        geometry: { 
            type: "Point", 
            coordinates: [survey.center.longitude, survey.center.latitude] 
        },
        properties: { 
            id: survey.id, 
            spacing: survey.spacing, 
            numTrees: survey.numTrees, 
            estimatedArea: survey.estimatedArea, 
            notes: survey.notes }
    }))
})