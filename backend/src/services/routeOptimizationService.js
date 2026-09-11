/**
 * FoodShareAI - A* Route Optimization Service
 * Implements the A* shortest-path algorithm:
 *   f(n) = g(n) + h(n)
 * where:
 *   g(n) = actual travel cost from origin to current node
 *   h(n) = admissible heuristic (Great-Circle Haversine distance to destination)
 *   f(n) = total estimated cost
 *
 * Explicit Rule: A* is the route optimization algorithm. KNN is NEVER used for routes.
 */
const { haversineDistanceKm, buildGeographicGraph } = require('./routeGraphService');

class PriorityQueue {
  constructor() {
    this.elements = [];
  }

  enqueue(item, priority) {
    this.elements.push({ item, priority });
    this.elements.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.elements.shift()?.item;
  }

  isEmpty() {
    return this.elements.length === 0;
  }
}

/**
 * Executes A* search on the provided RouteGraph
 * @param {RouteGraph} graph Routing graph
 * @param {string} startNodeId Origin node identifier
 * @param {string} goalNodeId Destination node identifier
 * @returns {object} { path: Array<string>, totalCost: number, distanceMeters: number }
 */
const findShortestPathAStar = (graph, startNodeId = 'start', goalNodeId = 'end') => {
  const goalNode = graph.getNode(goalNodeId);
  if (!goalNode) {
    throw new Error(`Goal node '${goalNodeId}' not found in routing graph`);
  }

  const frontier = new PriorityQueue();
  frontier.enqueue(startNodeId, 0);

  const cameFrom = new Map();
  const costSoFar = new Map();

  cameFrom.set(startNodeId, null);
  costSoFar.set(startNodeId, 0);

  while (!frontier.isEmpty()) {
    const current = frontier.dequeue();

    if (current === goalNodeId) {
      break;
    }

    const currentNode = graph.getNode(current);
    const neighbors = graph.getNeighbors(current);

    for (const edge of neighbors) {
      const next = edge.to;
      const newCost = costSoFar.get(current) + edge.cost;

      if (!costSoFar.has(next) || newCost < costSoFar.get(next)) {
        costSoFar.set(next, newCost);

        // Heuristic: Haversine distance from next node to goal node in meters
        const nextNode = graph.getNode(next);
        const h = haversineDistanceKm(nextNode.coordinates, goalNode.coordinates) * 1000;
        const priority = newCost + h; // f(n) = g(n) + h(n)

        frontier.enqueue(next, priority);
        cameFrom.set(next, current);
      }
    }
  }

  // Reconstruct path
  let current = goalNodeId;
  const path = [];

  while (current !== null) {
    path.push(current);
    current = cameFrom.get(current);
    if (current === undefined) {
      break; // No path found
    }
  }

  path.reverse();

  if (path.length === 0 || path[0] !== startNodeId) {
    throw new Error('A* routing algorithm was unable to find a viable path between points');
  }

  const distanceMeters = costSoFar.get(goalNodeId) || 0;

  return {
    path,
    totalCost: distanceMeters,
    distanceMeters: Math.round(distanceMeters),
  };
};

/**
 * Builds GeoJSON LineString coordinates and estimates duration
 * @param {RouteGraph} graph
 * @param {Array<string>} path
 * @returns {object} { geometry, distanceKm, estimatedDurationMinutes }
 */
const buildRouteGeometry = (graph, path) => {
  const coordinates = path.map((nodeId) => {
    const node = graph.getNode(nodeId);
    return [node.coordinates[0], node.coordinates[1]]; // [longitude, latitude]
  });

  // Calculate cumulative distance along path
  let totalKm = 0;
  for (let i = 0; i < coordinates.length - 1; i++) {
    totalKm += haversineDistanceKm(coordinates[i], coordinates[i + 1]);
  }

  totalKm = Math.round(totalKm * 100) / 100;

  // Average urban delivery vehicle speed ~ 25 km/h + 3 min handling buffer
  const avgSpeedKmh = 25;
  const estimatedDurationMinutes = Math.max(3, Math.round((totalKm / avgSpeedKmh) * 60 + 3));

  return {
    route: {
      type: 'LineString',
      coordinates,
    },
    distanceKm: totalKm,
    estimatedDurationMinutes,
  };
};

/**
 * Generates an optimized route for pickup to dropoff locations using A*
 * @param {[number, number]} pickupCoordinates [longitude, latitude]
 * @param {[number, number]} dropoffCoordinates [longitude, latitude]
 * @returns {object} Structured route details
 */
const generateRoute = (pickupCoordinates, dropoffCoordinates) => {
  if (!pickupCoordinates || !dropoffCoordinates) {
    throw new Error('Valid pickup and dropoff [longitude, latitude] coordinates are required');
  }

  // 1. Build OpenStreetMap-compatible road graph abstraction
  const graph = buildGeographicGraph(pickupCoordinates, dropoffCoordinates);

  // 2. Execute A* search
  const astarResult = findShortestPathAStar(graph, 'start', 'end');

  // 3. Construct GeoJSON LineString
  const routeData = buildRouteGeometry(graph, astarResult.path);

  return {
    algorithm: 'A*',
    routeSource: 'OpenStreetMap Graph',
    route: routeData.route,
    distanceKm: routeData.distanceKm,
    distanceMeters: astarResult.distanceMeters,
    estimatedDurationMinutes: routeData.estimatedDurationMinutes,
    nodePath: astarResult.path,
    generatedAt: new Date(),
  };
};

module.exports = {
  findShortestPathAStar,
  buildRouteGeometry,
  generateRoute,
};
