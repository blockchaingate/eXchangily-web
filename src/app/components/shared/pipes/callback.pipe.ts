import { Pipe, PipeTransform } from '@angular/core';

interface FilterObject {
    symbol: string;
}

@Pipe({
    name: 'callback',
    pure: false
})

export class CallbackPipe implements PipeTransform {
    transform(items: any[], callback: (item: any, select: string, searchText: string) => boolean, select: string, searchText: string): any {
        //console.log('select in transform', select);
        if (!items || !callback) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => callback(item, select, searchText));
    }
}
