export interface Property {
    id: string;
    ownerID: string;
    address: string;
    suburb: string;
    postcode: string;
    keyNo: string;
    managementFee: number;
    waterBillAccount: string;
    lastWaterBillReading: number;
    notes: string;
    other: string;
    createdAt: string | null;
    updatedAt: string | null;
  }
  