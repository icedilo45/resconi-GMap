import  { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

// Make it globally accessible
(global as any).navigationRef = navigationRef;