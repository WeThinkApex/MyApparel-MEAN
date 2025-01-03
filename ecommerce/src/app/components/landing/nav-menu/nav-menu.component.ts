import { Component } from '@angular/core';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  categories = [
    { name: 'ALL CATEGORIES', path: '/all-categories' },
    { name: 'GIRLS FASHION', path: '/girls-fashion' },
    { name: 'BOYS FASHION', path: '/boys-fashion' },
    { name: 'FOOTWEAR', path: '/footwear' },
    { name: 'TOYS', path: '/toys' },
    { name: 'DIAPRING', path: '/diapring' },
    { name: 'FEEDING', path: '/feeding' },
    { name: 'BATH', path: '/bath' },
    { name: 'NURSERY', path: '/nursery' },
    { name: 'MOMS', path: '/moms' },
    { name: 'HEALTH', path: '/health' },
    { name: 'BOUTIQUES', path: '/boutiques' }
  ];
}
