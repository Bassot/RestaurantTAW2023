import {Item} from "../Item/item";

export interface Order {
  id: string,
  price: number,
  items: Item[]

}
