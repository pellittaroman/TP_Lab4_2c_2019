import { Directive,Input, OnInit,ElementRef } from '@angular/core';

@Directive({
  selector: '[appTipo]'
})
export class TipoDirective implements  OnInit{
  @Input('appTipo') tipo: string;
  constructor(public elem:ElementRef) { }
  ngOnInit()
  {
    this.cambiar(this.tipo);
  }
cambiar(tipo)
{
  if(tipo=="Cliente")
  {
    this.elem.nativeElement.style.backgroundColor = "yellow";
  }
  if(tipo=="Recepcionista")
  {
    this.elem.nativeElement.style.backgroundColor = "red";
  }
  if(tipo=="Especialista")
  {
    this.elem.nativeElement.style.backgroundColor = "green";
  }
}
}
