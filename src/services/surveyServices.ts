import { db } from "./firebase";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { SurveyPoint, SurveyPolygon, CenterPointSurvey } from "@/utils/geo";
import { storage } from "./firebase";
import { ref, uploadBytes } from "firebase/storage";
import { getLocalPoints, getLocalPolygons, getLocalCenterPoints } from "../storage/localStorage";




export  const fetchPointSurveys = async (): Promise<SurveyPoint[]> => {
    const snapshot = await getDocs(collection(db, "points"));
    return snapshot.docs.map((doc) => doc.data() as SurveyPoint);
}

export  const fetchPolygonSurveys = async (): Promise<SurveyPolygon[]> => {
    const snapshot = await getDocs(collection(db, "polygons"));
    return snapshot.docs.map((doc) => doc.data() as SurveyPolygon);
}

export const fetchCenterPointSurveys = async (): Promise<CenterPointSurvey[]> => {
  const snapshot = await getDocs(collection(db, "centerpoints"));
  return snapshot.docs.map((doc) => doc.data() as CenterPointSurvey);
};



export const savePointSurvey = async (point: SurveyPoint) => {
  try {
    await setDoc(doc(db, "points", point.id), point);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const savePolygonSurvey = async (polygon: SurveyPolygon) => {
  try {
    await setDoc(doc(db, "polygons", polygon.id), polygon);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const saveCenterPointSurvey = async (centerPoint: CenterPointSurvey) => {
  try {
    await setDoc(doc(db, "centerPoints", centerPoint.id), centerPoint);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const uploadPhoto = async (uri: string, id: string) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  const storageRef = ref(storage, `photos/${id}.jpg`);
  await uploadBytes(storageRef, blob);
};

export const syncSurveys = async () => {
  try {
    const points = await getLocalPoints();
    for (const p of points) await savePointSurvey(p);

    const polygons = await getLocalPolygons();
    for (const poly of polygons) await savePolygonSurvey(poly);

    const centers = await getLocalCenterPoints();
    for (const c of centers) await saveCenterPointSurvey(c);

    console.log("Sync complete!");
  } catch (err) {
    console.error("Sync failed:", err);
  }
};