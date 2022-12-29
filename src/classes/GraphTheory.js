
export default class GraphTheory {
    constructor(destinations,connections) {
        this.destinations = destinations
        this.connections = connections
    }
    toGraph() {
        // Each key represents a node on the graph. 
        // Each value object contains key-value pairs that represent the node’s immediate neighbors and the distance of the path between node & neighbor
        /* let graph = {
            start: { A: 5, B: 2 },
            A: { start: 1, C: 4, D: 2 },
            B: { A: 8, D: 7 },
            C: { D: 6, finish: 3 },
            D: { finish: 1 },
            finish: {},
        }; */

        const graph = {}
        // We fill the graph object keys by destinations
        this.destinations.forEach(dest=>{
            graph[dest.name]={}
            // Now we have to find connected nodes to "dest"
            // We search on it in connections array
            const connectedNodes = this.connections.filter(connection=>connection.start===dest.name || connection.end===dest.name).map(connection=>{
                if(connection.start==dest.name) return connection.end
                return connection.start
            })
            
            connectedNodes.forEach(node=>{
                // Now we should calculate the distance between "dest.name" and "node" 
                // console.log(graph,nodeName);
                const nodeCoords = this.destinations.find((dest)=>dest.name===node).coords
                graph[dest.name][node] = distance(dest.coords.lat,nodeCoords.lat,dest.coords.lng,dest.coords.lng)
            })
        })
        return graph
    }
    Djikstra(){
        const graph = this.toGraph()
        const rs = findShortestPath(graph,"Position de départ","Position d'arrivé")
        console.log(rs);
        return  rs
        
    }

    BellmanFord() {
      const V = this.destinations.length // number of vertex
      const E = this.connections.length // number of edges

      const dic ={} // For mapping as {"Position de départ":0,"A":1,"B":2...}
      this.destinations.forEach((dest,i)=>{
        dic[dest.name] = i
      })

      // Chercher predesseceur point d'arrivé 

      // First off all we gonna need to set an "id" for all connections
      const graph = this.toGraph()
      const newConnections = this.connections.map((connection,i)=>{
        connection["distance"] = graph[connection.start][connection.end]
        return connection
      })

      const dis = Array(V).fill(Infinity)
      const p = Array(V).fill("")
      
      // initialize diantance of source as 0
      dis[0] = 0

      // console.log(newConnections);
      

      // Relax all edges |V| - 1 times. A simple
      // shortest path from src to any other
      // vertex can have at-most |V| - 1 edges

      for (let i = 0; i < V - 1; i++) {
        for (let j = 0; j < E; j++) {
          
          if (dis[dic[newConnections[j]["start"]]] + newConnections[j]["distance"] < dis[dic[newConnections[j]["end"]]]){
            dis[dic[newConnections[j]["end"]]] = dis[dic[newConnections[j]["start"]]] + newConnections[j]["distance"];
            p[j] = this.destinations[i]
            
          }
        }
      }

      console.log(p);

      console.log("\nVertex \t Distance from Source");
      for (let i = 0; i < V; i++) console.log(i + "\t\t" + dis[i]);

    }
    
    

}

const distance = (lat1, lat2, lon1, lon2)=>{

  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 =  lon1 * Math.PI / 180;
  lon2 = lon2 * Math.PI / 180;
  lat1 = lat1 * Math.PI / 180;
  lat2 = lat2 * Math.PI / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a = Math.pow(Math.sin(dlat / 2), 2)
  + Math.cos(lat1) * Math.cos(lat2)
  * Math.pow(Math.sin(dlon / 2),2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return(c * r);
}


const shortestDistanceNode = (distances, visited) => {
    // create a default value for shortest
      let shortest = null;
      
        // for each node in the distances object
      for (let node in distances) {
          // if no node has been assigned to shortest yet
            // or if the current node's distance is smaller than the current shortest
          let currentIsShortest =
              shortest === null || distances[node] < distances[shortest];
              
            // and if the current node is in the unvisited set
          if (currentIsShortest && !visited.includes(node)) {
              // update shortest to be the current node
              shortest = node;
          }
      }
      return shortest;
};


// Djikstra
const findShortestPath = (graph, startNode, endNode) => {
 
    // track distances from the start node using a hash object
      let distances = {};
    distances[endNode] = "Infinity";
    distances = Object.assign(distances, graph[startNode]);
   // track paths using a hash object
    let parents = { endNode: null };
    for (let child in graph[startNode]) {
     parents[child] = startNode;
    }
     
    // collect visited nodes
      let visited = [];
   // find the nearest node
      let node = shortestDistanceNode(distances, visited);
    
    // for that node:
    while (node) {
    // find its distance from the start node & its child nodes
     let distance = distances[node];
     let children = graph[node]; 
         
    // for each of those child nodes:
         for (let child in children) {
     
     // make sure each child node is not the start node
           if (String(child) === String(startNode)) {
             continue;
          } else {
             // save the distance from the start node to the child node
             let newdistance = distance + children[child];
   // if there's no recorded distance from the start node to the child node in the distances object
   // or if the recorded distance is shorter than the previously stored distance from the start node to the child node
             if (!distances[child] || distances[child] > newdistance) {
   // save the distance to the object
        distances[child] = newdistance;
   // record the path
        parents[child] = node;
       } 
            }
          }  
         // move the current node to the visited set
         visited.push(node);
   // move to the nearest neighbor node
         node = shortestDistanceNode(distances, visited);
       }
     
    // using the stored paths from start node to end node
    // record the shortest path
    let shortestPath = [endNode];
    let parent = parents[endNode];
    while (parent) {
     shortestPath.push(parent);
     parent = parents[parent];
    }
    shortestPath.reverse();
     
    //this is the shortest path
    let results = {
     distance: distances[endNode],
     path: shortestPath,
    };
    // return the shortest path & the end node's distance from the start node
      return results;
   };