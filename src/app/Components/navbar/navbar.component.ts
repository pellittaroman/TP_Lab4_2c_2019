import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

	public email: string;
	public type: string;
	public name: string;

	constructor(private authService: AuthService, private router: Router) {

		const token = localStorage.getItem('token');

		if(token == null){
    		this.email = '';
    		this.type = '';
    		this.name = '';
    	}

    	if(token != null){ 		
	    	const tokenInfo = JSON.parse(token);

	    	this.email = tokenInfo['email'];
	   		this.type = tokenInfo['type'];
			this.name = tokenInfo['name'];

    	}


	}

  	ngOnInit() {
  	}

  	logout() {
  		localStorage.removeItem('token');
    	//this.authService.logout();
    	this.router.navigate(['/Login']);
	}

}
