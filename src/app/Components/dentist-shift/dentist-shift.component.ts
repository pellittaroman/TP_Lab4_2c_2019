import { Component, OnInit } from '@angular/core';
import { DentistService } from '../../Services/dentist.service';
import { DentistShiftService } from '../../Services/dentist-shift.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User } from './../../Entities/user';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-dentist-shift',
  templateUrl: './dentist-shift.component.html',
  styleUrls: ['./dentist-shift.component.css']
})
export class DentistShiftComponent implements OnInit {

	  public form: FormGroup;
    public dateControl;
	  public dentistList = [];
    public user;
    public errorMessage: string;
    public error: boolean;
    public success: boolean;
  public dateControl1;
  	constructor(public formBuilder: FormBuilder, public fireStore:AngularFirestore, public dentistShift: DentistShiftService) {
      
       this.user = JSON.parse(localStorage.getItem('token'));

      this.resetForm(this.user.dni);

      this.errorMessage = '';
      this.error = false;
      this.success = false;
      this.dateControl = new Date().getFullYear().toString()+"-";
      this.dateControl+=(new Date().getMonth()+1).toString()+"-";
      this.dateControl+=new Date().getDate().toString();
      
      
      this.dateControl1=new Date().getDate().toString()+"/";
      this.dateControl1+=(new Date().getMonth()+1).toString()+"/";
      this.dateControl1+= new Date().getFullYear().toString();
      console.log(this.dateControl);
      this.fireStore.collection('users').snapshotChanges().subscribe((res) => {
        this.cargarE(res);
      });
  	}

    resetForm(dni: string){
      if(this.user.type=="Cliente"){
        this.form = this.formBuilder.group({
          dni: [dni, [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(8)]],
          date: ['', Validators.required, Validators.min(this.dateControl1)],
          hour: ['', [Validators.required]],
          duration: [15, [Validators.required, Validators.min(15), Validators.max(60)]],
          name: ['', Validators.required]
        });

      }
      else
      {
        this.form = this.formBuilder.group({
          dni: ['', [Validators.required, Validators.pattern('[0-9]*'), Validators.minLength(8), Validators.maxLength(8)]],
          date: ['', Validators.required],
          hour: ['', [Validators.required, Validators.min(8), Validators.max(19)]],
          duration: [15, [Validators.required, Validators.min(15), Validators.max(60)]],
          name: ['', Validators.required]
        });

      }
     
    }

  	ngOnInit() {

  	}

    public tryDentistShift(){

     

    if (this.form.valid) {
        const dni: string = this.form.get('dni').value;
        const date: string = this.form.get('date').value;
        const hour: string = this.form.get('hour').value;
        const name: string = this.form.get('name').value;
      if(new Date(date).getDay()!=6)
      {
          this.dentistShift.dentistShiftRegister(dni, date, hour, name)
        .then(
          response => {
                    this.success = true;
                    this.resetForm(dni);
                    location.reload();
                }
            )
            .catch(
                error => {
                  this.error = true;
                  this.errorMessage = error['Mensaje'];
                  console.log(error)
                }
            );
      }
      else
      {
        this.error = true;
        this.errorMessage = "Los domingos la clinica permanece cerrada";
      }
      
          } else {
              this.errorMessage = 'Debe completar los campos correctamente.';
          this.error = true;
        }
    }
    cargarE(res)
    {
      let user;
      this.dentistList=new Array();
      res.forEach(r => { 
        user = r.payload.doc.data();
        if (user["type"] == "Especialista") {
          
          this.dentistList.push({
            id: r.payload.doc.id,
            data: r.payload.doc.data()
            });
        }
      })
    
    }
   
}
