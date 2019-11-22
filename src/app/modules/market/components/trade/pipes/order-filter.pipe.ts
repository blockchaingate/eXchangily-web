import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'orderfilter',
    pure: false
})
export class OrderFilterPipe implements PipeTransform {
    transform(items: any[], filter: Object): any {
        if (!items) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.isActive === filter);
    }
}
