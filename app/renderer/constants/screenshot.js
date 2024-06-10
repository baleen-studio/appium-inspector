// Screenshot interaction modes
// TAP_SWIPE refers to both TAP and SWIPE
// GESTURE refers to playback via gesture editor
export const SCREENSHOT_INTERACTION_MODE = {
  SELECT: 'select',
  SWIPE: 'swipe',
  TAP: 'tap',
  TAP_SWIPE: 'tap_swipe',
  GESTURE: 'gesture',
  TEXT: 'text',
  CHECK: 'check',
  EXISTENCE: 'existence',
};

// Default parameters when executing coordinate-based swipe over app screenshot
export const DEFAULT_SWIPE = {
  POINTER_NAME: 'finger1',
  DURATION_1: 0,
  DURATION_2: 750000,
  BUTTON: 0,
  ORIGIN: 'viewport',
};

// Default parameters when executing coordinate-based tap over app screenshot
export const DEFAULT_TAP = {
  POINTER_NAME: 'finger1',
  DURATION_1: 0,
  DURATION_2: 100,
  BUTTON: 0,
  VALUE: '',
};

export const DEFAULT_TEXT = {
  DATA_TYPE: 'textField',
  NEW_TEXT: 'text',
  BUTTON: 0,
}

export const DEFAULT_CHECK = {
  DATA_TYPE: 'textLabel',
  NEW_TEXT: 'check',
  BUTTON: 0,
}

export const DEFAULT_EXISTENCE = {
  DATA_TYPE: 'everyType',
  NEW_TEXT: 'existence',
  BUTTON: 0,
}

// 3 Types of Centroids:
// CENTROID is the circle/square displayed on the screen
// EXPAND is the +/- circle displayed on the screen
// OVERLAP is the same as CENTROID but is only visible when clicked on +/- circle
export const RENDER_CENTROID_AS = {
  CENTROID: 'centroid',
  EXPAND: 'expand',
  OVERLAP: 'overlap',
};

export const CENTROID_STYLES = {
  VISIBLE: 'visible',
  HIDDEN: 'hidden',
  CONTAINER: '50%',
  NON_CONTAINER: '0%',
};
