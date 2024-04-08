import {Application} from '../declarations';
import inventory from './inventory/inventory.service';
import orders from './orders/orders.service';
import positions from './positions/positions.service';
import products from './products/products.service';
import rpc from './rpc/rpc.service';
import uploads from './uploads/uploads.service';
import users from './users/users.service';


export default function (app: Application): void {
    app.configure(rpc);
    app.configure(users);
    app.configure(uploads);
    app.configure(products);
    app.configure(orders);
    app.configure(inventory);
    app.configure(positions);
}
