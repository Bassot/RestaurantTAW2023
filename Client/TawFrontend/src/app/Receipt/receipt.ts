import {Queue_Item} from "../Queue/queue_item";

export interface Receipt{
  table: number,
  items: Queue_Item[],
  total: number,
  timestamp: Date
}
