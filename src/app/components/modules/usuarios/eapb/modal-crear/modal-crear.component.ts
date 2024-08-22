import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators  } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EAPB } from '../../../../../models/eapb.model';
import { GenericService } from '../../../../../services/generic.services';
import { CompartirDatosService } from '../../../../../services/compartir-datos.service';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-crear',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './modal-crear.component.html',
  styleUrl: './modal-crear.component.css'
})
export class ModalCrearComponent implements OnInit, OnChanges {
  @Input() item: any; // Recibe los datos del item
  @Input() isEditing: boolean = false; // Controla si está en modo edición

  contactForm!: FormGroup;

  listaEAPB: EAPB[] = [];

  constructor(private fb: FormBuilder, private dataService: GenericService, private compartirDatosService: CompartirDatosService) {}

  ngOnInit(): void {
    this.dataService.get('TablaParametrica/', 'CodigoEAPByNit', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEAPB = data
        this.listaEAPB.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Se presento un error al llenar la lista de EAPB', e),
      complete: () => console.info('Se lleno la lista de EAPB')
    });

    this.contactForm = this.fb.group({
      id: [''],
      entidadId: ['', [Validators.required]],
      nombres: [''],
      cargo: [''],
      telefonos: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}')]],
      estado: ['Activo']
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      console.log(this.isEditing);

      if (this.isEditing){
        this.contactForm.get('entidadId')?.enable();
        this.dataService.put(`api/ContactoEntidad/${this.contactForm.get('id')?.value}`, this.contactForm.value, 'Entidad').subscribe({
          next: (data: any) => this.compartirDatosService.emitirNuevoContactoEAPB(data),
          error: (e) => console.error('Se presento un error al actualizar el EAPB', e),
          complete: () => console.info('Se actualizo el EAPB')
        });
        console.log(`api/ContactoEntidad/${this.contactForm.get('id')?.value}`);
      }else{
        this.dataService.post('api/ContactoEntidad', this.contactForm.value, 'Entidad').subscribe({
          next: (data: any) => this.compartirDatosService.emitirNuevoContactoEAPB(data),
          error: (e) => console.error('Se presento un error al crear un EAPB', e),
          complete: () => console.info('Se creo el nuevo EAPB')
        });
      }
      
      this.close();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.isEditing) {
      // Si es modo edición, actualiza el formulario con los datos del item
      this.updateForm(this.item);
    } else if (!this.isEditing) {
      // Si no es modo edición, resetea el formulario
      this.resetForm();
    }
  }

  updateForm(item: any) {
    this.contactForm.patchValue(item);
    if (this.isEditing) {
      this.contactForm.get('entidadId')?.disable(); 
    } else {
      this.contactForm.get('entidadId')?.enable(); 
    }
  }

  resetForm() {
    this.contactForm.reset();
    this.contactForm.get('estado')?.setValue('Activo');
    this.contactForm.get('entidadId')?.enable();
  }

  open() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  close() {
    const modalElement = document.getElementById('exampleModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }
}
