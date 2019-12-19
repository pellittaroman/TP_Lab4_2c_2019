import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {

	@Output() email = new EventEmitter<String>();

	redirectUrl: string;

	user: Observable<firebase.User>;

	constructor(public fireAuth: AngularFireAuth, public fireStore: AngularFirestore, public router: Router) {
		this.user = fireAuth.authState;
	}

	signIn(email: string, password: string, type: string) {
		let usuario;
		this.fireAuth.auth.signInWithEmailAndPassword(email, password).then(value => {

			this.fireStore.collection('users').snapshotChanges().subscribe((res) => {
				res.forEach(r => { console.log(r.payload.doc.data());console.log(type);console.log(email);
					usuario = r.payload.doc.data();
					if (usuario["email"] == email && usuario["type"] == type) {
						localStorage.setItem("token", JSON.stringify(usuario));

						let now = new Date();

						const request: Object = {
							email: email,
							name: usuario['name'],
							type: type,
							date: now.toString(),
						};

	    				this.fireStore.collection('logs').add(request);

						console.log("Entro");

						//location.reload();

						this.router.navigate(['/Dashboard']);
						
						//this.router.navigate(['/Dashboard']);

						
					}
				})
			});

		})
		.catch(e => {
			console.log('Error, algo fallo!', e.message);
		});
	}

	signUp(email: string, password: string) {
		this.fireAuth
	      .auth
	      .createUserWithEmailAndPassword(email, password)
	      .then(value => {
	       
	        
	      })
	      .catch(err => {
	        console.log('Error, algo fallo!',err.message);
	      });    
	}

	logout() {
    	localStorage.removeItem("token");
    	this.fireAuth.auth.signOut();
    	//location.reload();
    	//this.router.navigate(['/Dashboard']);
	}
	Isauth()
	{
		return this.fireAuth.auth.currentUser.toJSON();
	}
}
