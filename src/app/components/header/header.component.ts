import { Component } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private menuService: MenuService) {}

  toggleMenu() {
    console.log('Que esta pasando');
    this.menuService.toggleMenu();
  }

}
