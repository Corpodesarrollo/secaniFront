import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenericService } from '../../../../../services/generic.services';
import { CompartirDatosService } from '../../../../../services/compartir-datos.service';
import { Entidad } from '../../../../../models/entidad.model';

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

  listaEntidades: Entidad[] = [];

  listaContactos: any[] = [];

  constructor(private fb: FormBuilder, private dataService: GenericService, private compartirDatosService: CompartirDatosService) {}

  ngOnInit(): void {
    this.dataService.get_withoutParameters('ET', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEntidades = data
        this.listaEntidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
      },
      error: (e) => console.error('Se presento un error al llenar la lista de ET para creacion', e),
      complete: () => console.info('Se lleno la lista de ET para creacion')
    });

    this.compartirDatosService.listaContactos$.subscribe(lista => {
      this.listaContactos = lista;
    });

    this.contactForm = this.fb.group({
      id: [''],
      entidadId: ['', [Validators.required]],
      nombres: [''],
      cargo: [''],
      telefonos: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      email: ['', [Validators.required, 
        Validators.pattern('[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*@[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)*[.][a-zA-Z]{2,5}'),
        this.validarEmailUnico.bind(this)]],
      estado: ['Activo'],
      activo: [true]
    });

    this.contactForm.get('estado')?.disable(); 
  }

  validarEmailUnico(control: AbstractControl) {
    if (!control.value || this.listaContactos.length === 0) {
      return null; // No validar si el campo está vacío o si la lista no está cargada aún
    }

    const emailExiste = this.listaContactos.some(contacto => 
      contacto.email === control.value && (!this.item || contacto.id !== this.item.id) // 🔥 Ignora el contacto en edición
    )

    return emailExiste ? { emailRepetido: true } : null;
  }

  onSubmit() {
    if (this.contactForm.valid) {
      this.contactForm.get('estado')?.enable(); 
      console.log(this.contactForm.value);
      console.log(this.isEditing);

      this.contactForm.get('estado')?.valueChanges.subscribe((estadoValue) => {
        this.contactForm.patchValue({
          activo: estadoValue === 'Activo',
        });
      });

      if (this.isEditing){
        this.contactForm.get('entidadId')?.enable();
        this.dataService.put(`ContactoEntidad/${this.contactForm.get('id')?.value}`, this.contactForm.value, 'Entidad').subscribe({
          next: (data: any) => this.compartirDatosService.emitirNuevoContactoEAPB(data),
          error: (e) => console.error('Se presento un error al actualizar la ET', e),
          complete: () => console.info('Se actualizo la ET')
        });
        console.log(`ContactoEntidad/${this.contactForm.get('id')?.value}`);
      }else{
        this.dataService.post('ContactoEntidad', this.contactForm.value, 'Entidad').subscribe({
          next: (data: any) => {
            this.compartirDatosService.emitirNuevoContactoEAPB(data)
            //console.log("Ahora esto es lo que retorna",data)
          },
          error: (e) => console.error('Se presento un error al crear un contacto de ET', e),
          complete: () => console.info('Se creo el nuevo contacto de ET')
        });
      }
      this.resetForm();
      this.close();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['item'] && this.isEditing) {
      // Si es modo edición, actualiza el formulario con los datos del item
      this.updateForm(this.item);
    } else if (!this.isEditing) {
      this.resetForm();
    }
  }

  updateForm(item: any) {
    this.contactForm.patchValue(item);
    if (this.isEditing) {
      this.contactForm.get('entidadId')?.disable(); 
      this.contactForm.get('estado')?.enable(); 
    } else {
      this.contactForm.get('entidadId')?.enable(); 
      this.contactForm.get('estado')?.enable(); 
    }
  }

  resetForm() {
    this.contactForm.reset();
    this.contactForm.get('estado')?.setValue('Activo');
    this.contactForm.get('estado')?.enable(); 
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

