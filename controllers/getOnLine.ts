const newPoints: [number, number][] = []
const Dubins = import("../DubinsJS/dubins.js"),
const dubWorker = new Dubins()
dubWorker.shortestAndSample([
    // start x, y, and heading
    start.x,
    start.y,
    start.heading // in radians
  ], [
    // end x, y, and heading
    end.x,
    end.y,
    end.heading // in radians
  ],
  turning_radius,
  step_size, 
  (q, _) => {
    // callback, you will need this in order to get your interpolated points
    newPoints.push([q[0], q[1]])
    return 0
  })