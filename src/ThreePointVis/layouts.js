import * as React from 'react';
import { useSpring } from 'react-spring/three';

function gridLayout(data) {
  const numPoints = data.length;
  const numCols = Math.ceil(Math.sqrt(numPoints));
  const numRows = numCols;

  for (let i = 0; i < numPoints; ++i) {
    const datum = data[i];
    const col = (i % numCols) - numCols / 2;
    const row = Math.floor(i / numCols) - numRows / 2;

    datum.x = col * 1.05;
    datum.y = row * 1.05;
    datum.z = 0;
  }
}

function spiralLayout(data) {
  // equidistant points on a spiral
  let theta = 0;
  for (let i = 0; i < data.length; ++i) {
    const datum = data[i];
    const radius = Math.max(1, Math.sqrt(i + 1) * 0.8);
    theta += Math.asin(1 / radius) * 1;

    datum.x = radius * Math.cos(theta);
    datum.y = radius * Math.sin(theta);
    datum.z = 0;
  }
}

// We modify the data to show as classified categories
function twitterLayout(data) {
  const numOfClasses = 5

  // for (let i = 0; i < numOfClasses; i++) {

  // }
  for (let i= 0; i < data.length; ++i) {
    const datum = data[i]
    const thetastart = datum.class * Math.PI * 2 / numOfClasses + Math.PI * 10/180
    const thetaend = (datum.class + 1) * Math.PI * 2 / numOfClasses - Math.PI * 10/180

    const randomTheta = Math.random() * (thetaend - thetastart) + thetastart

    datum.x = Math.cos(randomTheta) * datum.distanceFromLoc
    datum.y = Math.sin(randomTheta) * datum.distanceFromLoc
    datum.z = 0
  }
}

export const useLayout = ({ data, layout = 'grid' }) => {
  React.useEffect(() => {
    switch (layout) {
      case 'spiral':
        spiralLayout(data);
        break;
      case 'twitter':
        twitterLayout(data);
        break;
      case 'grid':
      default: {
        gridLayout(data);
      }
    }
  }, [data, layout]);
};

function useSourceTargetLayout({ data, layout }) {
  // prep for new animation by storing source
  React.useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      data[i].sourceX = data[i].x || 0;
      data[i].sourceY = data[i].y || 0;
      data[i].sourceZ = data[i].z || 0;
    }
  }, [data, layout]);

  // run layout
  useLayout({ data, layout });

  // store target
  React.useEffect(() => {
    for (let i = 0; i < data.length; ++i) {
      data[i].targetX = data[i].x;
      data[i].targetY = data[i].y;
      data[i].targetZ = data[i].z;
    }
  }, [data, layout]);
}

function interpolateSourceTarget(data, progress) {
  for (let i = 0; i < data.length; ++i) {
    data[i].x = (1 - progress) * data[i].sourceX + progress * data[i].targetX;
    data[i].y = (1 - progress) * data[i].sourceY + progress * data[i].targetY;
    data[i].z = (1 - progress) * data[i].sourceZ + progress * data[i].targetZ;
  }
}

export function useAnimatedLayout({ data, layout, onFrame }) {
  // compute layout remembering initial position as source and
  // end position as target
  useSourceTargetLayout({ data, layout });

  // do the actual animation when layout changes
  const prevLayout = React.useRef(layout);
  useSpring({
    animationProgress: 1,
    from: { animationProgress: 0 },
    reset: layout !== prevLayout.current,
    onFrame: ({ animationProgress }) => {
      // interpolate based on progress
      interpolateSourceTarget(data, animationProgress);
      // callback to indicate data has updated
      onFrame({ animationProgress });
    },
  });
  prevLayout.current = layout;
}
