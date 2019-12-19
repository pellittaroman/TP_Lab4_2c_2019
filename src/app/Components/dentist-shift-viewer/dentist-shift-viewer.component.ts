import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { DentistShiftService } from '../../Services/dentist-shift.service';
import { ReviewService } from '../../Services/review.service';
import { PollService } from '../../Services/poll.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import * as $ from "jquery";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from "ngx-spinner";
import * as PDF from 'jspdf';
import html2canvas from 'html2canvas';
import { DentistService } from 'src/app/Services/dentist.service';

// import * as CanvasJS from './canvasjs.min';

@Component({
  selector: 'app-dentist-shift-viewer',
  templateUrl: './dentist-shift-viewer.component.html',
  styleUrls: ['./dentist-shift-viewer.component.css']
})
export class DentistShiftViewerComponent implements OnInit {

  @ViewChild('modal1',{static: true}) modal1: ElementRef;
  @ViewChild('modal2',{static: true}) modal2: ElementRef;
  @ViewChild('encuesta',{static: true}) encuesta: ElementRef;
  @ViewChild('review',{static: true}) review: ElementRef;

  @Input() public id;
  @Input() public dni;
  public fecha:string;	
  public modalReference1: any = null;
  public modalReference2: any = null;
  public reviewReference: any = null;
  public modalReference3: any= null

  public form1: FormGroup;
  public form2: FormGroup;

  public dentistShiftList = [];
  public isMsj:boolean=false;
  public reviews = [];
  public polls= [];
  public user;
	public especialista=[];	
	public filtro;
  //public isSpecialist: boolean = false;
	public dateControl;
  //public open: boolean = false;


  public show: number = 0;

  constructor(public dentistShift: DentistShiftService, private fireStore: AngularFirestore, private modalService: NgbModal, public formBuilder1: FormBuilder, public formBuilder2: FormBuilder, public reviewService: ReviewService, public pollService: PollService, private spinner: NgxSpinnerService,public dentist:DentistService ) {

  	this.user = JSON.parse(localStorage.getItem('token'));

  	if(this.user.type == "Especialista"){
		  this.dentistShiftList=new Array();
		  
		this.fireStore.collection('dentistShifts').snapshotChanges().subscribe((res) => {
			this.cargarEsp(res);
		});
			//this.isSpecialist = true;
  	}
  	else if(this.user.type == "Cliente"){
		  console.log(this.user.dni);
		  this.dentistShiftList=new Array();
		  

		  this.fireStore.collection('dentistShifts').snapshotChanges().subscribe((res) => {
			this.cargarCli(res); 
			});
  	}
  	else{
		
		this.dentistShiftList=new Array();
		this.fireStore.collection('dentistShifts').snapshotChanges().subscribe((res) => {
				this.cargarT(res);
				});
  	}

  	this.form1 = this.formBuilder1.group({
  			code: ['', [Validators.required]],
  			descReview: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(66)]]
  	});

  	this.form2 = this.formBuilder2.group({
  			dni: ['', [Validators.required]],
  			clinic: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
  			specialist: [0, [Validators.required, Validators.min(1), Validators.max(10)]],
  			descPoll: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(66)]]
  	});
	  this.fireStore.collection('users').snapshotChanges().subscribe((res) => {
		  this.cargarE(res);
	  });
	  this.dateControl = new Date().getFullYear().toString()+"-";
      this.dateControl+=(new Date().getMonth()+1).toString()+"-";
      this.dateControl+=new Date().getDate().toString();
  }

  ngOnInit() {
	  
  }

  public attend(id: string, dni: string, date: string, hour: string, specialist: string) {

  	this.spinner.show();

  	const data: Object = {
  		dni: dni,
  		date: date,
  		hour: hour,
  		specialist: specialist,
		status: 'Atendido',
		resena: false,
		encuesta:false,  
  	};

	this.dentistShiftList = [];

  	this.fireStore.collection('dentistShifts').doc(id).set(data);

  	setTimeout(() => 
	{
	   location.reload();
	},
	3000);
  }

  public cancel(id: string){

  	this.spinner.show();

  	this.dentistShiftList = [];
  	
  	this.fireStore.collection('dentistShifts').doc(id).delete();

  	setTimeout(() => 
	{
	   location.reload();
	},
	3000)

  }

  public openModal1(id: string){


  	this.modalReference1 = this.modalService.open(this.modal1);

  	this.id = id;

  }
  mandar(a:string)
  {
	  this.filtro=a;
  }

  public closeModal1(){
  	this.modalReference1.close();
  }

  public openModal2(dni: string,id: string ){

  	this.modalReference2 = this.modalService.open(this.modal2);

  	this.dni = dni;
	this.id = id;
  }
  public openModal3(id: string ){

	this.modalReference3 = this.modalService.open(this.encuesta);

	
  this.id = id;
 
  this.fireStore.collection('polls').snapshotChanges().subscribe((res) => {
	this.cargarPoll(id,res);
});

}
public cargarPoll(id,res)
{
	let rew;
	this.polls=new Array();
	res.forEach(r => {
		rew = r.payload.doc.data();

		if(rew["id"] == id){

			this.polls.push({
				
				data: r.payload.doc.data()
			  });

		}
		
	})
}
public closeModal3(){
	this.modalReference3.close();
}

  public closeModal2(){
  	this.modalReference2.close();
  }

  public tryReview(){
	
  	console.log(this.form1.valid);
  	console.log(this.form1.get('code').value);
  	console.log(this.form1.get('descReview').value);
  	
  	if(this.form1.valid){
  		const code: string = this.form1.get('code').value;
		const desc: string = this.form1.get('descReview').value;
		
		this.fireStore.collection('dentistShifts').doc(this.id).update({
			resena:true
		});
		this.reviewService.reviewRegister(code, desc);
		this.closeModal1();
		
	  }
	  
  }

  public viewReview(id: string){

  	this.reviewReference = this.modalService.open(this.review);


		this.fireStore.collection('reviews').snapshotChanges().subscribe((res) => {
			this.cargarRew(id,res);
		});
	}
	public cargarRew(id,res)
	{
		let rew;
		this.reviews=new Array();
		res.forEach(r => {
			rew = r.payload.doc.data();

			if(rew["code"] == id){

				this.reviews.push({
					id: r.payload.doc.id,
					data: r.payload.doc.data()
				  });

			}
			
		})
	}

  public closeReview(){
  	this.reviewReference.close();
  }

  public tryPoll(){
	console.log(this.id);
  	console.log(this.form2.valid);
  	this.isMsj=false;
  	if(this.form2.valid){
  		const dni: string = this.form2.get('dni').value;
  		const clinic: string = this.form2.get('clinic').value;
  		const specialist: string=  this.form2.get('specialist').value;
		const desc: string = this.form2.get('descPoll').value;
		
		this.pollService.pollRegister(dni, clinic, specialist, desc,this.id);
		this.fireStore.collection('dentistShifts').doc(this.id).update({
			encuesta:true
		});
		this.closeModal2();
	  }
	  else
	  {
			console.log("estoy aca");
		  this.isMsj=true;
	  }
  }


  public generarPDF()  
  {  
    var data = document.getElementById('tablaPDF');  
    html2canvas(data).then(canvas => {  
      // Few necessary setting options  
      var imgWidth = 208;   
      var pageHeight = 295;    
      var imgHeight = canvas.height * imgWidth / canvas.width;  
      var heightLeft = imgHeight;  
  
      const contentDataURL = canvas.toDataURL('image/png')  
      let pdf = new PDF('p', 'mm', 'a4'); // A4 size page of PDF  
	  var position = 20;
	  pdf.text('Clinica Buena Sonrisa',75,10);
	  pdf.text('__________________',75,11); 
	  pdf.addImage(contentDataURL, 'PNG', 1, position, imgWidth, imgHeight);
	  pdf.text(this.dateControl,180,6);   
      pdf.save('PDFTurnos.pdf'); // Generated PDF   
    });  
  } 
  cargarCli(res)
  {
	  let shift;
	  this.dentistShiftList=new Array();
	res.forEach(r => {
		shift = r.payload.doc.data();

		if(shift["dni"] == this.user.dni){

			console.log("Entro más");

			console.log(shift["date"]);

			this.dentistShiftList.push({
				id: r.payload.doc.id,
				data: r.payload.doc.data()
			  });

		}	              

	});
  } 
  cargarEsp(res)
  {
	let shift;
	this.dentistShiftList=new Array();
	res.forEach(r => {
		shift = r.payload.doc.data();

		if(shift["specialist"] == this.user.name){

			this.dentistShiftList.push({
				id: r.payload.doc.id,
				data: r.payload.doc.data()
			  });

		}	              

	})

  }
  cargarT(res)
  {
	this.dentistShiftList=new Array();
	res.forEach(r => {
		this.dentistShiftList.push({
			id: r.payload.doc.id,
			data: r.payload.doc.data()
		  })})
  }
  cargarE(res)
  { 
	  let user;
		this.especialista=new Array();
	  res.forEach(r => { 
		user = r.payload.doc.data();
		if (user["type"] == "Especialista") {
		  
			this.especialista.push({
				id: r.payload.doc.id,
				data: r.payload.doc.data()
			  });
		}
	})

  }

}
