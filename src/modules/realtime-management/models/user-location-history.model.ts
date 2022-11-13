export interface UserLocationHistoryModel {
  collectRoute: {
    listCoordinates: number[][];
    startPoint?: number[];
    endPoint?: number[];
  };
  collectOrder: {
    collectPoints: {
      name: string;
      latitude: number;
      longitude: number;
      id: number;
      isCollected: boolean;
    }[];
  };
  history: {
    latitude: number;
    longitude: number;
    currentWeight: number;
  }[];
  listCollectedPoints: number[];
  vehicleName: string;
  vehicleId: number;
  maxWeight: number;
  routeName: string;
  loadingWeight: number;
  userName: string;
  currentLat: number;
  currentLong: number;
  lastActiveTime: string;
}
