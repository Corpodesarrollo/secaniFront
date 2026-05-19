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
    // BUG-LZ-044/045: backend FluentValidation exige Nombres NotEmpty. Antes el frontend no lo
    // requeria -> form valido -> POST/PUT -> backend 400 BadRequest -> modal igual se cerraba
    // (porque close() era sincrono despues del subscribe). User percibia que no guardaba.
    this.contactForm = this.fb.group({
      id: [''],
      entidadId: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
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
        // BUG-LZ-016: normalizar codigo a String para que <option [value]="eapb.codigo"> matchee
        // con el formControl entidadId (siempre String). Antes los codigos numericos en TP no
        // se mostraban como selected en el <select> aunque la EAPB existiera.
        this.listaEAPB = (data || []).map((e: any) => ({ ...e, codigo: e.codigo != null ? String(e.codigo) : '' }));
        this.listaEAPB.sort((a, b) => a.nombre.localeCompare(b.nombre));
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
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.contactForm.get('estado')?.enable();
    const payload = this.contactForm.value;
    console.log('payload', payload, 'isEditing', this.isEditing);

    if (this.isEditing){
      this.contactForm.get('entidadId')?.enable();
      this.dataService.put(`ContactoEntidad/${this.contactForm.get('id')?.value}`, payload, 'Entidad').subscribe({
        // BUG-LZ-044: cerrar modal SOLO si backend confirmo. Antes close() era sincrono y
        // ocurria aun con 400 BadRequest -> user pensaba que guardaba pero no.
        next: (data: any) => {
          this.compartirDatosService.emitirNuevoContactoEAPB(data);
          this.resetForm();
          this.close();
        },
        error: (e) => {
          console.error('Error al actualizar contacto EAPB', e);
          const detalle = e?.error?.message || e?.error?.[0]?.errorMessage || 'No fue posible actualizar el contacto. Verifique los campos requeridos.';
          alert(detalle);
        }
      });
    } else {
      this.dataService.post('ContactoEntidad', payload, 'Entidad').subscribe({
        // BUG-LZ-045: idem que 044.
        next: (data: any) => {
          this.compartirDatosService.emitirNuevoContactoEAPB(data);
          this.resetForm();
          this.close();
        },
        error: (e) => {
          console.error('Error al crear contacto EAPB', e);
          const detalle = e?.error?.message || e?.error?.[0]?.errorMessage || 'No fue posible crear el contacto. Verifique los campos requeridos.';
          alert(detalle);
        }
      });
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
