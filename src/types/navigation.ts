import { CenterPointSurvey, SurveyPoint, SurveyPolygon } from "@/utils/geo";

export type RootStackParamList = {
    Login: undefined;
    Map: undefined;
    Splash: undefined;
    SurveyList: undefined;
    SurveyCreate: undefined;
    EditSurvey: {
        survey: SurveyPoint | SurveyPolygon | CenterPointSurvey;
        type: "point" | "polygon" | "center";
        onUpdate?: (updatedSurvey: SurveyPoint | SurveyPolygon | CenterPointSurvey) => void;
    }
    SurveyDetail: { survey: any }
};