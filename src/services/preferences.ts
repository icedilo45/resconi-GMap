import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getPreference(key: string): Promise<boolean> {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : true; // default true
  } catch (err) {
    console.error(`Failed to load preference ${key}:`, err);
    return true;
  }
}

export async function savePreference(key: string, value: boolean): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to save preference ${key}:`, err);
  }
}

export async function saveVolume(value: number): Promise<void> {
  try {
    await AsyncStorage.setItem("soundVolume", JSON.stringify(value));
  } catch (err) {
    console.error("Failed to save volume:", err);
  }
}

export async function getVolume(): Promise<number> {
  try {
    const value = await AsyncStorage.getItem("soundVolume");
    return value ? JSON.parse(value) : 1.0; // default full volume
  } catch (err) {
    console.error("Failed to load volume:", err);
    return 1.0;
  }
}

export async function saveAnimationStyle(style: string): Promise<void> {
  try {
    await AsyncStorage.setItem("animationStyle", style);
  } catch (err) {
    console.error("Failed to save animation style:", err);
  }
}

export async function getAnimationStyle(): Promise<string> {
  try {
    const value = await AsyncStorage.getItem("animationStyle");
    return value ? value : "default"; // fallback
  } catch (err) {
    console.error("Failed to load animation style:", err);
    return "default";
  }
}
