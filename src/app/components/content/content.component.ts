import { Component, HostListener } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  isMenuCollapsed = true;

  rol: any = 1;

  constructor(private menuService: MenuService, public router: Router) {}

  ngOnInit() {
    this.menuService.currentMenuState.subscribe(isCollapsed => {
      this.isMenuCollapsed = isCollapsed;
    });


  }

}
