import { Component, HostListener } from '@angular/core';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

  isMenuCollapsed = true;

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.menuService.currentMenuState.subscribe(isCollapsed => {
      this.isMenuCollapsed = isCollapsed;
    });
  }

}
