import { Directive, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import { PermisosService } from "../services/permisos.service";

export type PermisoKey = 'canAdd' | 'canEdit' | 'canView' | 'canDele';

@Directive({
    selector: '[appPermiso]',
    standalone: true,
    hostDirectives: [],
    providers: []
})
export class PermisoDirective implements OnInit {
    @Input('appPermiso') permisoKey!: PermisoKey;
    @Input() path!: string;
    @Input() mode: 'hide' | 'disable' = 'hide';

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private permisosService: PermisosService
    ) { }

    ngOnInit() {
        if (!this.path || !this.permisoKey) {
            return this.ocultar();
        }

        this.permisosService.getPermisos(this.path).subscribe(permisos => {
            const tienePermiso = permisos?.[this.permisoKey];
            if (!tienePermiso) {
                this.mode === 'hide' ? this.ocultar() : this.deshabilitar();
            }
        });
    }

    ocultar() {
        this.renderer.setStyle(this.el.nativeElement, 'display', 'none');
    }

    deshabilitar() {
        this.renderer.setProperty(this.el.nativeElement, 'disabled', true);
        this.renderer.addClass(this.el.nativeElement, 'disabled');
        this.renderer.setStyle(this.el.nativeElement, 'pointer-events', 'none');
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0.5');
    }
}
