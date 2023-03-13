import { Carpool, Directions } from "../entities/carpool.entity";
import { EventToUser } from "../../event-to-user/entities/event-to-user.entity";
import { Address } from "../../address/entities/address.entity";
import { Route } from "../dto/Route.interface";

import Openrouteservice from "openrouteservice-js";

function calculateDistance(start: Address, end: Address): number {
  // Code pour appeler l'API Open Maps et calculer la distance entre les points de départ et d'arrivée
  const orsMatrix = new Openrouteservice.Matrix({ api_key: "dsds" });
  const distance = 2;
  return distance;
}

function match(carpools: Carpool[], passengers: EventToUser[]): Route[] {
  const routes: Route[] = [];

  // Pour chaque paire de conducteur et de passager, trouver le trajet le plus court entre leurs points de départ respectifs et d'arrivée respectifs
  for (const carpool of carpools) {
    for (const passenger of passengers) {
      // Vérifier si le conducteur et le passager se dirigent dans la même direction
      if (carpool.direction === Directions.go) {
        if (carpool.endPoint === passenger.event.address) {
          const distance = calculateDistance(
            carpool.startPoint,
            passenger.address,
          );
          routes.push({
            carpool: carpool,
            departure: undefined,
            destination: carpool.endPoint,
            index: 0,
            length: 0,
            pickup: passenger.user,
            starting: passenger.address,
          });
        }
      } else {
        if (carpool.endPoint === passenger.address) {
          const distance = calculateDistance(
            carpool.startPoint,
            passenger.event.address,
          );
          routes.push({
            carpool: carpool,
            departure: undefined,
            destination: carpool.endPoint,
            index: 0,
            length: 0,
            pickup: passenger.user,
            starting: passenger.address,
          });
        }
      }
    }
  }

  // Trier les trajets en fonction de la distance
  // routes.sort((a, b) => a.distance - b.distance);

  return routes;
}
