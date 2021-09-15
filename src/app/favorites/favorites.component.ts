import { Component, OnInit, Inject } from '@angular/core';
import { Favorites } from '../shared/sdk/models';
import { FavoritesApi } from '../shared/sdk/services';
import { Customer, AccessToken } from '../shared/sdk/models';
import { CustomerApi } from '../shared/sdk/services';
import { flyInOut, expand } from '../animations/app.animation';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  // tslint:disable-next-line:use-host-property-decorator
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class FavoritesComponent implements OnInit {

  favorites: Favorites = undefined;
  customer: Customer = undefined;
  delete: boolean;
  errMess: string;

  constructor(private favoriteService: FavoritesApi,
    private authService: CustomerApi,
    @Inject('baseURL') private baseURL) { }

  ngOnInit() {
    this.customer = this.authService.getCachedCurrent();
    if (this.customer) {
      this.authService.getFavorites(this.customer.id, {'include': ['dishes']})
        .subscribe((favorites: Favorites) => { console.log(favorites); this.favorites = favorites; },
          errmess => this.errMess = <any>errmess);
    } else {
      this.errMess = 'No User Logged in!';
    }
  }

  deleteFavorite(id: string) {
    this.favoriteService.deleteById(id)
      .subscribe(() => {
        this.authService.getFavorites(this.customer.id, {'include': ['dishes']})
        .subscribe((favorites: Favorites) => this.favorites = favorites);
      },
        errmess => this.errMess = <any>errmess);
    this.delete = false;
  }

}
