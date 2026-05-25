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

  constructor(private fb: FormBuilder, private dataService: GenericService, private compartirDatosService: CompartirDatosService) {
    // BUG-smoke-C: ngOnChanges puede ejecutarse ANTES de ngOnInit (lifecycle Angular). Antes
    // contactForm se inicializaba en ngOnInit → resetForm en ngOnChanges crashea por undefined.
    // Paridad con eapb/modal-crear.component.ts que ya lo hace bien.
    this.contactForm = this.fb.group({
      id: [''],
      entidadId: ['', [Validators.required]],
      nombres: [''],
      cargo: [''],
      telefonos: ['', [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      email: ['', [Validators.required,
        // BUG-LZ-077: regex previa rechazaba guion (-) en email RFC 5322 valido.
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
        this.validarEmailUnico.bind(this)]],
      estado: ['Activo'],
      activo: [true]
    });
    this.contactForm.get('estado')?.disable();
  }

  ngOnInit(): void {
    this.dataService.get_withoutParameters('ET', 'TablaParametrica').subscribe({
      next: (data: any) => {
        this.listaEntidades = data
        this.listaEntidades.sort((a, b) => a.nombre.localeCompare(b.nombre));
        // BUG-LZ-016: re-aplica patchValue tras cargar opciones
        if (this.isEditing && this.item) {
          this.contactForm.patchValue({
            ...this.item,
            entidadId: this.item.entidadId != null ? String(this.item.entidadId) : ''
          });
        }
      },
      error: (e) => console.error('Se presento un error al llenar la lista de ET para creacion', e),
      complete: () => console.info('Se lleno la lista de ET para creacion')
    });

    this.compartirDatosService.listaContactos$.subscribe(lista => {
      this.listaContactos = lista;
    });
  }

  validarEmailUnico(control: AbstractControl) {
    if (!control.value || this.listaContactos.length === 0) {
      return null; // No validar si el campo está vacío o si la lista no está cargada aún
    }

    // BUG-LZ-021: comparar IDs como string para evitar falso positivo cuando el id viene como número/string
    const itemIdStr = this.item?.id != null ? String(this.item.id) : null;
    const emailExiste = this.listaContactos.some(contacto =>
      contacto.email === control.value && (!itemIdStr || String(contacto.id) !== itemIdStr)
    );

    return emailExiste ? { emailRepetido: true } : null;
  }

  onCancel() {
    // BUG-LZ-020: cierre explícito que descarta cambios sin emitir update
    this.resetForm();
    this.close();
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      // BUG-LZ-020: el botón Actualizar quedaba siempre disabled; ahora valida en click y muestra errores
      this.contactForm.markAllAsTouched();
      return;
    }
    // BUG-LZ-059 root cause: contactForm.value excluye disabled controls. entidadId
    // disabled en edit -> payload sin EntidadId -> backend SQL "Cannot insert NULL".
    // Fix: enable + getRawValue() para incluir disabled.
    this.contactForm.get('estado')?.enable();
    this.contactForm.get('entidadId')?.enable();
    const payload = this.contactForm.getRawValue();
    if (this.isEditing){
      this.dataService.put(`ContactoEntidad/${this.contactForm.get('id')?.value}`, payload, 'Entidad').subscribe({
        // BUG-LZ-044: cerrar SOLO si backend confirmo.
        next: (data: any) => {
          this.compartirDatosService.emitirNuevoContactoEAPB(data);
          this.resetForm();
          this.close();
        },
        error: (e) => {
          console.error('Error al actualizar contacto ET', e);
          alert(e?.error?.message || e?.error?.[0]?.errorMessage || 'No fue posible actualizar el contacto. Verifique los campos requeridos.');
        }
      });
    } else {
      this.dataService.post('ContactoEntidad', payload, 'Entidad').subscribe({
        // BUG-LZ-045: idem.
        next: (data: any) => {
          this.compartirDatosService.emitirNuevoContactoEAPB(data);
          this.resetForm();
          this.close();
        },
        error: (e) => {
          console.error('Error al crear contacto ET', e);
          alert(e?.error?.message || e?.error?.[0]?.errorMessage || 'No fue posible crear el contacto. Verifique los campos requeridos.');
        }
      });
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
    // BUG-LZ-016 (analogo ET): coercion string para que el select encuentre la option
    this.contactForm.patchValue({
      ...item,
      entidadId: item?.entidadId != null ? String(item.entidadId) : ''
    });
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

