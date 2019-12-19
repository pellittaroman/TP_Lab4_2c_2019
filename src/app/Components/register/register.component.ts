import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from './../../Services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

	public form: FormGroup;
	selectedFiles: FileList;
	foto;
	public errorMessage: string;
	public error: boolean;
	public success: boolean;

  	constructor(public formBuilder: FormBuilder, public userService: UserService, private router: Router) {
  		this.resetForm();

  		this.errorMessage = '';
  		this.error = false;
  		this.success = false;
  	}

	ngOnInit() {
	}


	public resetForm(){
		this.form = this.formBuilder.group({
  			dni: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(8)]],
  			email: ['', [Validators.required, Validators.email]],
  			password: ['', [Validators.required, Validators.minLength(6)]],
  			name: ['', [Validators.required]],
  			
  			type: ['', [Validators.required]],
  			foto: ['', [Validators.required, Validators.nullValidator]],
        recaptcha: ['']
  		});
	}

	public tryRegister(){

		if (this.form.valid) {
			const dni: string = this.form.get('dni').value;
			const email: string = this.form.get('email').value;
	    	const password: string = this.form.get('password').value;
	    	const name: string = this.form.get('name').value;
	    
	    	const type: string = this.form.get('type').value;

	    	//let file = this.form.get('file');
	    	

			this.userService.userRegister(dni, email, password, name, type, this.foto);
				
    			} else {
      				this.errorMessage = 'Debe completar los campos correctamente.';
					this.error = true;
				}
				this.router.navigate(['/Dashboard']);
	}


	onFileChange(event) {
		this.foto=event[0].base64;
		}
  }	

