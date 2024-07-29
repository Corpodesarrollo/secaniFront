import { Component } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-crear',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './modal-crear.component.html',
  styleUrl: './modal-crear.component.css'
})
export class ModalCrearComponent {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      entity: ['', [Validators.required]],
      name: [''],
      cargo: [''],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['Activo']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
    }
  }

}
