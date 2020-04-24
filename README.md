# STL Viewer

A simple WebGL-based STL viewer web application designed for Chromium and Firefox. This project provides an interactive 3D canvas where users can upload and explore STL models directly in the browser.

## Overview

- The viewer displays 3D models inside an HTML5 `<canvas>` element with accessible ARIA labels.
- Users can upload STL files via a built-in file prompt UI.
- Two camera modes are available for flexible model exploration:
  - **Orbit Mode:** Rotate the camera around the model by dragging the mouse.
  - **Free Mode:** Allows freer camera movement for advanced viewing.
- The interface includes a toggleable menu to switch between camera modes.
- The app supports both **binary** and **ASCII** STL formats.

## Interaction Controls

- **Left-click + drag:** Rotate camera around the model.
- **Right-click + drag:** Roll the camera.
- **Hold CTRL + drag:** Rotate the model itself instead of the camera.
- **Camera Mode Menu:** Switch between orbit and free camera controls.

## Code Structure

The app is modularized into several JavaScript files, each handling specific responsibilities:

- `consts.js` — constant values and enums.
- `math.js` — math utilities for 3D transformations.
- `3d.js` — 3D model and geometry management.
- `load.js` — STL file parsing and loading.
- `interact.js` — user input handling.
- `ui.js` — UI components and event binding.
- `render.js` — WebGL rendering pipeline.
- `main.js` — app initialization and main loop.
- `menuanimate.js` — animated UI menu behavior.

## Accessibility

- ARIA attributes are used throughout for screen reader compatibility.
- The file prompt and camera controls are keyboard-navigable.
- Visual indicators like the file name update live for assistive technology.
