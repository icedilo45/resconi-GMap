import React, { useState, useEffect, useRef } from "react";
import { View, Text, Switch, Animated } from "react-native";
import { savePreference } from "@/services/preferences"; 
import { getVolume, saveVolume } from "@/services/preferences";
import Slider from '@react-native-community/slider';  
import { Audio } from 'expo-av'; 
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { RadioButton } from "react-native-paper";
import { getAnimationStyle, saveAnimationStyle } from "@/services/preferences";

export default function SettingsScreen() {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);
  const [volume, setVolume] = useState(1.0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const colorAnim = useRef(new Animated.Value(0)).current;
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const [animationStyle, setAnimationStyle] = useState("default");

  
  useEffect(() => {
    (async () => {
      setVolume(await getVolume());
      setAnimationStyle(await getAnimationStyle());
    })();
  }, []);
  
  const changeAnimationStyle = async (style: string) => {
    setAnimationStyle(style);
    await saveAnimationStyle(style);
    triggerIconAnimation(style);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return 'volume-mute'
    if (volume < 0.4) return 'volume-low'
    if (volume < 0.7) return 'volume-medium'
    return 'volume-high'
  };

  const iconColor = colorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [volume === 0 ? "gray" : "green", "yellow"], 
  }) as Animated.AnimatedInterpolation<string>;;

  const triggerIconAnimation = (style: string) => {
    let friction = 3;
    let tension = 100;

    switch (style || animationStyle) {
      case "snappy":
        friction = 2;
        tension = 150;
        break;
      case "rubbery":
        friction = 3;
        tension = 80;
        break;
      case "soft":
        friction = 6;
        tension = 60;
        break;
      default:
        friction = 3;
        tension = 100;
    }

    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.3,
          friction,
          tension,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction,
          tension,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.timing(colorAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }),
        Animated.timing(colorAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }),
      ]),
    ]).start();

    ReactNativeHapticFeedback.trigger("impactMedium", {
      enableVibrateFallback: true,
      ignoreAndroidSystemSettings: false,
    });
  };


  const playPreviewSound = async (vol: number) => {
    try {
      const sound = new Audio.Sound();
      await sound.loadAsync(require("@/assets/sounds/success.mp3"));
      await sound.setVolumeAsync(vol);
      await sound.playAsync();
      triggerIconAnimation(animationStyle);
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish ) sound.unloadAsync();
      });
    } catch (err) {
      console.error("Preview sound failed:", err);
    }
  };

  const toggleSound = async () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    await savePreference("soundEnabled", newValue);
  };

  const toggleHaptic = async () => {
    const newValue = !hapticEnabled;
    setHapticEnabled(newValue);
    await savePreference("hapticEnabled", newValue);
  };

  let previewTimeout: number | null = null;
  const changeVolume = async (newValue: number) => {
    setVolume(newValue);
    await saveVolume(newValue);
    if (previewTimeout) clearTimeout(previewTimeout);
    previewTimeout = setTimeout(() => playPreviewSound(newValue), 500);
  };

  return (
    <><View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Preferences</Text>

      {/* Sound Toggle */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <Text style={{ flex: 1 }}>Enable Sound</Text>
        <Switch value={soundEnabled} onValueChange={toggleSound} />
      </View>

      {/* Haptic Toggle */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <Text style={{ flex: 1 }}>Enable Haptic</Text>
        <Switch value={hapticEnabled} onValueChange={toggleHaptic} />
      </View>

      {/* Volume Slider */}
      {soundEnabled && (
        <View style={{ marginTop: 10 }}>
          <Text style={{ flex: 1 }}>Sound Volume</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Slider
              style={{ width: "100%", height: 40 }}
              value={volume}
              onValueChange={changeVolume}
              minimumValue={0}
              maximumValue={1}
              step={0.1} />
            <AnimatedIcon
              name={getVolumeIcon()}
              size={28}
              style={{ transform: [{ scale: scaleAnim }], color: iconColor }} />
          </View>
          <Text>{Math.round(volume * 100)}%</Text>
        </View>
      )}
    </View><View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 16 }}>Animation Style</Text>
        <RadioButton.Group
          onValueChange={changeAnimationStyle}
          value={animationStyle}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="snappy" />
            <Text>Snappy</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="rubbery" />
            <Text>Rubbery</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <RadioButton value="soft" />
            <Text>Soft</Text>
          </View>
        </RadioButton.Group>
      </View></>
  );
}
