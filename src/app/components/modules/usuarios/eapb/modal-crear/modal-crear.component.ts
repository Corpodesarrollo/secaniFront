import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms'; 
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EAPB } from '../../../../../models/eapb.model';
import { GenericService } from '../../../../../services/generic.services';
import { CompartirDatosService } from '../../../../../services/compartir-datos.service';
import { PermisoDirective } from '../../../../../directives/permiso.directive';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-crear',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, PermisoDirective],
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
        // BUG-LZ-077: regex previa rechazaba guion (-) y otros caracteres validos en RFC 5322 (e.g. luz-pineros@gmail.com)
        Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'),
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
          this.ensureEAPBPlaceholder(codigo);
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

  // BUG-LZ-043 (extension): si el codigo del contacto no esta en la lista paramétrica de EAPB
  // (eliminada/desactivada en TP), insertar option placeholder "EAPB no encontrada (código: X)"
  // para que el <select> muestre algo coherente con la tabla padre en vez de quedar vacio.
  private ensureEAPBPlaceholder(codigo: string): void {
    if (!codigo) return;
    const existe = this.listaEAPB.some(e => String(e.codigo) === codigo);
    if (!existe) {
      this.listaEAPB = [
        { codigo: codigo, nombre: `EAPB no encontrada (código: ${codigo})` } as any,
        ...this.listaEAPB
      ];
    }
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

  // BUG-LZ-059: parser de errores robusto cubriendo todos los shapes que ASP.NET puede emitir:
  // - FluentValidation: array [{errorMessage}]
  // - BadRequest objeto: {field, message}
  // - ModelState problem details: {errors: {Email: [...]}}
  // - String plano (500 sin formato)
  // - Sin error explicito (status code)
  // BUG-LZ-059 secundario: si el PUT retornaba 201 Created Location (que algunos clients tratan
  // como error porque GET de Location no resuelve), tratarlo como exito si guard guarda.
  private extraerMensajeError(e: any, defaultMsg: string): string {
    if (!e) return defaultMsg;
    const err = e.error;
    if (err) {
      if (typeof err === 'string' && err.trim()) return err;
      if (err.message) return err.message;
      if (err.title) return err.title;
      if (err.errors) {
        const firstKey = Object.keys(err.errors)[0];
        const arr = firstKey ? err.errors[firstKey] : null;
        if (Array.isArray(arr) && arr[0]) return `${firstKey}: ${arr[0]}`;
      }
      if (Array.isArray(err) && err[0]?.errorMessage) return err[0].errorMessage;
    }
    return `${defaultMsg} (HTTP ${e?.status ?? 'desconocido'})`;
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    // BUG-LZ-059 root cause: contactForm.value EXCLUYE controles disabled. En modo edicion
    // entidadId se deshabilita (line updateForm), entonces payload llegaba sin EntidadId ->
    // backend insert SQL fallaba con "Cannot insert NULL into column EntidadId" -> 500.
    // Fix: usar getRawValue() para incluir controles disabled.
    this.contactForm.get('estado')?.enable();
    this.contactForm.get('entidadId')?.enable();
    const payload = this.contactForm.getRawValue();
    console.log('payload', payload, 'isEditing', this.isEditing);

    if (this.isEditing){
      this.dataService.put(`ContactoEntidad/${this.contactForm.get('id')?.value}`, payload, 'Entidad').subscribe({
        // BUG-LZ-044: cerrar modal SOLO si backend confirmo.
        next: (data: any) => {
          this.compartirDatosService.emitirNuevoContactoEAPB(data);
          this.resetForm();
          this.close();
        },
        error: (e) => {
          // BUG-LZ-059: backend retorna 201 CreatedAtAction con Location apuntando a GetById.
          // HttpClient sigue Location y si la respuesta intermedia no es JSON puede caer aqui
          // aunque el PUT haya guardado bien. Si status 2xx tratar como exito.
          if (e?.status >= 200 && e?.status < 300) {
            this.compartirDatosService.emitirNuevoContactoEAPB({ ...payload, id: this.contactForm.get('id')?.value });
            this.resetForm();
            this.close();
            return;
          }
          console.error('Error al actualizar contacto EAPB', e);
          alert(this.extraerMensajeError(e, 'No fue posible actualizar el contacto.'));
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
          // BUG-LZ-061: idem 059 — POST puede retornar 201 con Location.
          if (e?.status >= 200 && e?.status < 300) {
            // No tenemos id del backend, pero refrescamos lista via parent reload signal
            this.compartirDatosService.emitirNuevoContactoEAPB({ ...payload, id: null });
            this.resetForm();
            this.close();
            return;
          }
          console.error('Error al crear contacto EAPB', e);
          alert(this.extraerMensajeError(e, 'No fue posible crear el contacto.'));
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
    const codigo = item?.entidadId != null ? String(item.entidadId) : '';
    // BUG-LZ-043 (extension): garantizar placeholder cuando el codigo no esta en listaEAPB
    // (ngOnInit solo corre 1 vez; al reabrir modal con item distinto la lista puede no incluirlo).
    this.ensureEAPBPlaceholder(codigo);
    this.contactForm.patchValue({
      ...item,
      entidadId: codigo
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
    // BUG-LZ-060: al cancelar + reabrir, form conservaba data porque ngOnChanges no se dispara
    // si @Input() item no cambio. Reset explicito en open() para modo creacion.
    // BUG-LZ-043: en modo edicion, si user borra campos + cancela, ngOnChanges tampoco dispara
    // (item ref no cambio) y al reabrir form muestra campos vacios. Re-patch del item original.
    if (this.isEditing && this.item) {
      this.updateForm(this.item);
    } else {
      this.resetForm();
    }
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
