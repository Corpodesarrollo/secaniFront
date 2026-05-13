import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; 
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

  listaContactos: any[] = [];

  constructor(private fb: FormBuilder, private dataService: GenericService, private compartirDatosService: CompartirDatosService) {
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
  }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('EAPB', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEAPB = data
        this.listaEAPB.sort((a, b) => a.nombre.localeCompare(b.nombre));
        // BUG-LZ-016: si el contacto a editar apunta a una EAPB que ya no existe en la TP
        // (eliminada por sincronizacion SISPRO), inyectar opcion sintetica para no perder el codigo.
        if (this.isEditing && this.item) {
          const codigo = this.item.entidadId != null ? String(this.item.entidadId) : '';
          const existe = this.listaEAPB.some(e => String(e.codigo) === codigo);
          if (codigo && !existe) {
            this.listaEAPB = [
              { codigo: codigo, nombre: `EAPB no encontrada (código: ${codigo})` } as any,
              ...this.listaEAPB
            ];
          }
          this.contactForm.patchValue({
            ...this.item,
            entidadId: codigo
          });
        }
      },
      error: (e) => console.error('Se presento un error al llenar la lista de EAPB para creacion', e),
      complete: () => console.info('Se lleno la lista de EAPB para creacion')
    });

    this.compartirDatosService.listaContactos$.subscribe(lista => {
      this.listaContactos = lista;
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
          error: (e) => console.error('Se presento un error al actualizar el EAPB', e),
          complete: () => console.info('Se actualizo el EAPB')
        });
        console.log(`ContactoEntidad/${this.contactForm.get('id')?.value}`);
      }else{
        this.dataService.post('ContactoEntidad', this.contactForm.value, 'Entidad').subscribe({
          next: (data: any) => {
            this.compartirDatosService.emitirNuevoContactoEAPB(data)
            console.log("Ahora esto es lo que retorna",data)
          },
          error: (e) => console.error('Se presento un error al crear un EAPB', e),
          complete: () => console.info('Se creo el nuevo EAPB')
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
      // Si no es modo edición, resetea el formulario
      this.resetForm();
    }
  }

  updateForm(item: any) {
    // BUG-LZ-016: forzar string en entidadId para que coincida con [value] del select
    this.contactForm.patchValue({
      ...item,
      entidadId: item?.entidadId != null ? String(item.entidadId) : ''
    });
    if (this.isEditing) {
      this.contactForm.get('entidadId')?.disable();
      this.contactForm.get('estado')?.enable();
    } else {
      this.contactForm.get('entidadId')?.enable();
      this.contactForm.get('estado')?.disable();
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
