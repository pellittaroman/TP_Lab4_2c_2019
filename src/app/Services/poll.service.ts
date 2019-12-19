import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PollService {

	public polls = [];

	constructor(private fireStore: AngularFirestore) {}


	pollRegister(dni: string, clinic: string, specialist: string, desc: string,id:string): Promise<Object>{

  	//Validación...

  		const request: Object = {
	      dni: dni,
	      clinic: clinic,
	      specialist: specialist,
		  desc: desc,
		  id: id
	    };

	    return this.fireStore.collection('polls').add(request);
  	}

  	public returnById(id: string) {

		//return this.fireStore.collection('users').snapshotChanges();
		let review;

	  this.fireStore.collection('polls').snapshotChanges().subscribe((res) => {
		  res.forEach(r => {
			  review = r.payload.doc.data();

			  if(review["id"] == id){

				  this.polls.push({
					  
					  data: r.payload.doc.data()
					});

			  }
			  
		  })
	  });

	  return this.polls;
	}
}
