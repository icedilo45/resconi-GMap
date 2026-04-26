import  { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Make it globally accessible
(globalThis as any).navigationRef = navigationRef;