export interface FreightData {
  region: string;
  directLocation: {
    freight: number;
    quantity: number;
    freightPerQty: number;
  };
  oda: {
    freight: number;
    quantity: number;
    freightPerQty: number;
  };
  grandTotal: {
    freight: number;
    quantity: number;
    freightPerQty: number;
  };
}

export interface MonthlyData {
  month: string;
  data: FreightData[];
}

interface FreightBlock {
  freight: number;
  quantity: number;
  freightPerQty: number;
}

interface FreightRow {
  region: string;
  directLocation: FreightBlock;
  oda: FreightBlock;
  grandTotal: FreightBlock;
}

export interface MonthlyData {
  month: string;
  data: FreightRow[];
}
