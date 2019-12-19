import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireUploadTask } from '@angular/fire/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  	constructor(private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private authService:AuthService,private ruta:Router) { }

  	public userLogin(email: string, password: string, type: string){
  		this.authService.signIn(email, password, type);
  	}

  	public userRegister(dni: string, email: string, password: string, name: string, type: string, file: string) {
	    const request: Object = {
	      dni: dni,
	      email: email,
	      password: password,
	      name: name,
	      foto: file,
	      type: type
	    };
		this.authService.signUp(email, password);
	    
	}
}
