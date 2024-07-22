import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-permisos',
  standalone: true,
  imports: [RouterModule, CheckboxModule, FormsModule],
  templateUrl: './permisos.component.html',
  styleUrl: './permisos.component.css'
})

export class PermisosComponent {
  checked1: boolean = false;
  checked2: boolean = false;
  checked3: boolean = false;
  checked4: boolean = false;
}
