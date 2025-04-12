import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";
// Purchase class to represent a purchase in the e-commerce application
export class Purchase {
    order?: Order;
    customer?: Customer;
    shippingAddress?: Address;
    billingAddress?: Address;
    orderItems?: OrderItem[];
}
