export interface Fare {
  type: string;
  purchase: string;
  price: number;
  trips: number;
}

export interface Zone {
  zone: number;
  fares: Fare[];
  name: string;
}

export interface FareData {
  zones: Zone[];
  info: {
    anytime: string;
    weekday: string;
    evening_weekend: string;
    advance_purchase: string;
    onboard_purchase: string;
  };
}
