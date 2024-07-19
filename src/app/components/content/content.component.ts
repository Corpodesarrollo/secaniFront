import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { NavMenuComponent } from "../nav-menu/nav-menu.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, NavMenuComponent, RouterModule],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent {

}
