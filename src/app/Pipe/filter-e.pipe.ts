import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterE'
})
export class FilterEPipe implements PipeTransform {

  transform(value: any, arg: any[]): any {
    const result=[];
    for(const turns of value )
    {
      if(turns.data.specialist==arg)
      {
        result.push(turns);
      }
    }
    return result;
  }

}
