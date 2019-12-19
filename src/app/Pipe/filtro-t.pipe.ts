import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filtroT'
})
export class FiltroTPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    var fechaLog:string;
    var mes:string;
    var anio:string;
    var dia:string;
    var hora:string;
    var min:string;
   
       
       let arr=value.split(" ");
       
      for(let i=0;i<arr.length;i++)
      {
        
        if(arr[1])
        {
          
          switch(arr[1])
          {
            case 'Nov':
            mes="11"
            break;
            case 'Dec':
              mes="12"
              break;
          }
        }
        if(arr[2])
        {
          dia=arr[2];
        }
        if(arr[3])
        {
          anio=arr[3];
        }
        if(arr[4])
        {
          let aux=arr[4].split(":");
          hora=aux[0];
          min=aux[1];
        }
       return fechaLog= dia+"/"+mes+"/"+anio+" "+hora+":"+min;
      }
  

}
}
