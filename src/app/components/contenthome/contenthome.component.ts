import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contenthome',
  templateUrl: './contenthome.component.html',
  styleUrls: ['./contenthome.component.css']
})

export class ContenthomeComponent implements OnInit {
  rol: any = 1;
  constructor(public router: Router) { }

  ngOnInit() {
    if(this.rol == 1) {
      this.router.navigate(['dashboard-agente-seguimiento']);
    }
    else
    if(this.rol == 2) {
      this.router.navigate(['dashboard-coordinador']);
    }
    if(this.rol == 3) {
      this.router.navigate(['dashboard-eapb']);
    }
  }

}
