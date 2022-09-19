interface DataType {
    key: string;
    type: string;
    name: string;
    numberPlate: string;
}

const data: DataType[] = [
    {
        key: "1",
        type: "2T Truck",
        name: "2T Car 1",
        numberPlate: "Kagoshima 100Ah 11-11"
    },
    {
        key: "2",
        type: "3T Truck",
        name: "2T Car 1",
        numberPlate: "Kagoshima 100Ah 11-11"
    },
    {
        key: "3",
        type: "4T Truck",
        name: "2T Car 1",
        numberPlate: "Kagoshima 100Ah 11-11"
    },
    {
        key: "4",
        type: "5T Truck",
        name: "2T Car 1",
        numberPlate: "Kagoshima 100Ah 11-11"
    }
];

export function getListVehicle(): DataType[] {
    return data
}
