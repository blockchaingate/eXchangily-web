import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'filterByChain',
    pure: false
})
export class FilterByChainPipe implements PipeTransform {



    transform(items: any[], chain?: string): any {
        if(chain == 'All') {
            return items;
        }
        return items.filter(item => (item.name == chain && !item.tokenType) || item.tokenType == chain);
    }
}