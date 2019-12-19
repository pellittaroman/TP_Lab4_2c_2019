import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, args: any): any {
    const result=[];
    var fechaLog:string;
    var mes:string;
    var anio:string;
    var dia:string;
    console.log(args);
    for(const log of value)
    {
       let time:string=log.data.date;
       let arr=time.split(" ");
       
      for(let i=0;i<arr.length;i++)
      {
        if(arr[1])
        {
          
          switch(arr[1])
          {
            case 'Nov':
            mes="11-"
            break;
            case 'Dec':
              mes="12-"
              break;
          }
        }
        if(arr[2])
        {
          dia=arr[2]
        }
        if(arr[3])
        {
          anio=arr[3]+"-";
        }
        fechaLog=anio+mes+dia;
       
      }
      if(fechaLog==args)
      {
        result.push(log);
      }
    }
    return result;
  }

}
