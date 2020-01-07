import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderfilter',
    pure: false
})
export class OrderFilterPipe implements PipeTransform {
    transform(items: any[], orderStatus: string): any {
        if (!items) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        if (orderStatus === 'open') {
            return items.filter(item => item.isActive);
        } else
        if (orderStatus === 'close') {
            return items.filter(item => !item.isActive && (Number(item.orderQuantity) === 0));
        } else {
            return items.filter(item => !item.isActive && (Number(item.orderQuantity) > 0));
        }
        
    }
}
