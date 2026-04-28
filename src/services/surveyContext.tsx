import React, { createContext, useState, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getPointSurveys, getPolygonSurveys, getCenterPointSurveys, createSurvey } from "@/services/surveyService";

type SurveyContextType = {
  pointSurveys: any[];
  polygonSurveys: any[];
  centerSurveys: any[];
  loadSurveys: () => Promise<void>;
  addSurvey: (payload: any) => Promise<void>;
};

const SurveyContext = createContext<SurveyContextType | null>(null);

export const SurveyProvider = ({ children }: { children: React.ReactNode }) => {
  const [pointSurveys, setPointSurveys] = useState<any[]>([]);
  const [polygonSurveys, setPolygonSurveys] = useState<any[]>([]);
  const [centerSurveys, setCenterSurveys] = useState<any[]>([]);

  const loadSurveys = async () => {
    try {
      const cached = await AsyncStorage.getItem("surveys");
      if (cached) {
        const parsed = JSON.parse(cached);
        setPointSurveys(parsed.points || []);
        setPolygonSurveys(parsed.polygons || []);
        setCenterSurveys(parsed.centers || []);
      }

      const [points, polygons, centers] = await Promise.all([
        getPointSurveys(),
        getPolygonSurveys(),
        getCenterPointSurveys(),
      ]);

      setPointSurveys(points);
      setPolygonSurveys(polygons);
      setCenterSurveys(centers);

      await AsyncStorage.setItem(
        "surveys",
        JSON.stringify({ points, polygons, centers })
      );
    } catch (err) {
      console.error("Failed to load surveys:", err);
    }
  };

  const addSurvey = async (payload: any) => {
    const newSurvey = await createSurvey(payload);
    // Decide which bucket to update
    if (newSurvey.coords?.length > 0) {
      setPolygonSurveys(prev => {
        const updated = [...prev, newSurvey];
        AsyncStorage.setItem("surveys", JSON.stringify({ points: pointSurveys, polygons: updated, centers: centerSurveys }));
        return updated;
      });
    } else if (newSurvey.center) {
      setCenterSurveys(prev => {
        const updated = [...prev, newSurvey];
        AsyncStorage.setItem("surveys", JSON.stringify({ points: pointSurveys, polygons: polygonSurveys, centers: updated }));
        return updated;
      });
    } else {
      setPointSurveys(prev => {
        const updated = [...prev, newSurvey];
        AsyncStorage.setItem("surveys", JSON.stringify({ points: updated, polygons: polygonSurveys, centers: centerSurveys }));
        return updated;
      });
    }
  };

  return (
    <SurveyContext.Provider value={{ pointSurveys, polygonSurveys, centerSurveys, loadSurveys, addSurvey }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveys = () => {
  const ctx = useContext(SurveyContext);
  if (!ctx) throw new Error("useSurveys must be used within SurveyProvider");
  return ctx;
};
