// Definición de la interfaz SubMenuDTO
export interface SubMenuModel {
    permisoId: number;
    roleId: string;
    roleNombre: string;
    funcionalidadNombre: string;
    menuId: number;
    menuNombre: string;
    menuPath: string;
    menuIcon: string;
    menuOrden: number;
    menuIdPadre: number;
    tieneSubMenu: number;
}

// Definición de la interfaz MenuDTO
export interface MenuModel {
    permisoId: number;
    roleId: string;
    roleNombre: string;
    funcionalidadNombre: string;
    menuId: number;
    menuNombre: string;
    menuPath: string;
    menuIcon: string;
    menuOrden: number;
    menuIdPadre: number;
    tieneSubMenu: number;
    subMenus?: SubMenuModel[]; // SubMenus es opcional
}
