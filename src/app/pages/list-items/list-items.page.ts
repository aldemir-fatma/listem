import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { ShoppingService } from 'src/app/services/shopping.service';
import { ActivatedRoute } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-list-items',
  templateUrl: './list-items.page.html',
  styleUrls: ['./list-items.page.scss'],
})
export class ListItemsPage implements OnInit {

  listItems = [];
  listId = '';

  constructor(
    private shoppingService: ShoppingService,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.listId = this.route.snapshot.paramMap.get('id');
    
    this.loadListItems();
  }

  async loadListItems() {
    const loading = await this.loadingCtrl.create({
      message: 'Yükleniyor..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.shoppingService.getShoppingListItems(this.listId).subscribe(
      (res) => {
        console.log(res);
        loading.dismiss();
        this.listItems = [];
        this.listItems.push(...res);
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  async checkboxClick(event:any, item:any){
    let status = event.detail.checked;
    let id = item.id;

    const loading = await this.loadingCtrl.create({
      message: 'Yükleniyor..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.shoppingService.setShoppingListItem(id, status).subscribe(
      (res) => {
        console.log(res);
        loading.dismiss();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

  async addShoppingListItem() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Ürün Ekle',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Ürün adı'
        }
      ],
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Ekle',
          handler: async (event:any) => {
            console.log(event);
            const loading = await this.loadingCtrl.create({
              message: 'Yükleniyor..',
              spinner: 'bubbles',
            });
            await loading.present();
        
            this.shoppingService.addShoppingListItem(event.name, this.listId).subscribe(
              (res) => {
                loading.dismiss();
                this.loadListItems();
                event?.target.complete();
                if (event) {
                  event.target.disabled = true;
                }
              },
              (err) => {
                console.log(err);
                loading.dismiss();
              }
            );
          }
        }
      ]
    });

    await alert.present();
  }

  async removeShoppingListItem(id:string) {
    const urunId = id;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dikkat!',
      message: 'Ürün listeden kaldırılacak. Emin misiniz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Evet',
          id: 'confirm-button',
          handler: (event) => {
            this.deleteListItem(urunId);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteListItem(id:string){

    const loading = await this.loadingCtrl.create({
      message: 'Yükleniyor..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.shoppingService.deleteShoppingListItem(id).subscribe(
      (res) => {
        loading.dismiss();
        this.loadListItems();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }
}


