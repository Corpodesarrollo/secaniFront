import { Component } from '@angular/core';
import { CarouselModule } from 'primeng/carousel';


@Component({
  selector: 'app-crear-contacto',
  standalone: true,
  imports: [CarouselModule],
  templateUrl: './crear-contacto.component.html',
  styleUrl: './crear-contacto.component.css'
})
export class CrearContactoComponent {

}
