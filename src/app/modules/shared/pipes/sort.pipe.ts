import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
    name: 'sortByField',
    pure: false
})

export class SortByFieldPipe implements PipeTransform {
    transform(items: any[], field?: string, fieldType?: string, asc?: boolean): any {
        //console.log('field for sort=', field);
        if(!items || items.length == 0) {
            return items;
        }
        //console.log('select in transform', select);
        if (!field || field.length == 0) {
            // console.log('return items=', items);
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out

        if(fieldType == 'string') {
            items.sort(function(a, b) {
                if(asc) 
                    return a[field].localeCompare(b[field]);
                return b[field].localeCompare(a[field]);
            }); 
        } else if(fieldType == 'number')
        {
            items.sort(function(a, b) {
                if(asc) 
                    return a[field] - b[field];
                return b[field] - a[field];
            });             
        }
     
        return items;
    }
}
