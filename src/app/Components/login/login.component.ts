import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './../../Services/user.service';
import { Router } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

	  public form: FormGroup;
    public rand;
    public rand1;
    public randt;
    public errorMessage: string;
    public error: boolean;
    public success: boolean;
   public resul;
  	constructor(public formBuilder: FormBuilder, public userService: UserService, private router: Router) {
  		this.form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
  		  type: ['selccione tipo', [Validators.required]],
       
        loader: ['inicio rapido', [Validators.required]]
      });

      this.errorMessage = '';
      this.error = false;
      this.success = false;
      this.rand= Math.floor(Math.random()*10+1);
      this.rand1= Math.floor(Math.random()*10+1);
      this.randt= this.rand1+this.rand;
     this.randt=this.randt.toString();
      console.log(this.randt);
  	}

  	ngOnInit() {
  	}

    public defaultLoader(type: string){

      let user: any = '';

      switch(type){
        case 'Administrador':
        user = { email: 'administrador@gmail.com', password: '123456', type: 'Administrador', loader: 'Administrador' };
        this.form.setValue(user);
        break;
        case 'Especialista':
        user = { email: 'especialista@gmail.com', password: '123456', type: 'Especialista', loader: 'Especialista' };
        this.form.setValue(user);
        break;
        case 'Recepcionista':
        user = { email: 'recepcionista@gmail.com', password: '123456', type: 'Recepcionista', loader: 'Recepcionista' };
        this.form.setValue(user);
        break;
        case 'Cliente':
        user = { email: 'cliente@gmail.com', password: '123456', type: 'Cliente', loader: 'Cliente' };
        this.form.setValue(user);
        break;
        default:
        user = { email: '', password: '', type: 'Cliente', loader: '' };
        break;
      }

    }

  	public tryLogin(){

      if (this.form.valid) {
    		const email: string = this.form.get('email').value;
      	const password: string = this.form.get('password').value;
        const type: string = this.form.get('type').value;
        const aux= this.validar();
      if(aux==true)
      {
        this.userService.userLogin(email, password, type);
      }
      else
      {
        this.errorMessage="Ingrese el resultado correcto";
        this.error = true;
      
      }
      } else {
        this.errorMessage = 'Debe completar los campos correctamente.';
        this.error = true;
      }

    }
    validar():boolean
    {
      let ok=false;
     console.log(this.resul);
      if(this.resul==this.randt)
      {
        ok=true;
      }
      console.log(ok);
      return ok;
    }

}
