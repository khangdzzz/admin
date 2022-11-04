export interface UserLocationHistoryModel {
  collectRoute: {
    listCoordinates: number[][];
  };
  collectOrder: {
    collectPoints: {
      name: string;
      latitude: number;
      longitude: number;
    }[];
  };
  history: {
    latitude: number;
    longitude: number;
    currentWeight: number;
  }[];
  listCollectedPoints: number[];
}
