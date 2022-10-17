interface MockData {
  name: string;
  shortName: string;
  kana: string;
  postalCode: string;
  address: string;
  phoneNumber: string;
  email: string;
  representative: string;
  externalCode: string;
}

export const getCustomerDetail = (): MockData => {
  return {
    name: "Kashuma Tashaki",
    shortName: "Kashuma",
    kana: "きキみミ",
    postalCode: "895-0011",
    address: "3-33 Kandacho",
    phoneNumber: "+81 (0)999-22-3333",
    email: "kandacho@gmail.com",
    representative: "Kashuma Tashaki",
    externalCode: "XD1234"
  };
};
