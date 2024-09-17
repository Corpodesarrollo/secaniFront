import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private menuCollapsedSource = new BehaviorSubject<boolean>(true);
  currentMenuState = this.menuCollapsedSource.asObservable();

  toggleMenu() {
    this.menuCollapsedSource.next(!this.menuCollapsedSource.getValue());
  }

}
