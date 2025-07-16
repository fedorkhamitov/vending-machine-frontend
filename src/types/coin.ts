export interface Coin {
  denomination: number;
  quantity: number;
}

export interface InsertedCoins {
  [denomination: number]: number;
}
