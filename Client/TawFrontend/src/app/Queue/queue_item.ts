export interface Queue_Item{
  _id: string,
  name: string,
  type: string,
  price: number,
  timestamp: Date,    //to order te queue
  status: string,
  table: number,
  waiter: string
}
