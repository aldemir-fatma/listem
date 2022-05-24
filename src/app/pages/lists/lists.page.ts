import { Component, OnInit } from '@angular/core';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { ShoppingService } from 'src/app/services/shopping.service';
import { AlertController } from '@ionic/angular';


@Component({
  selector: 'app-lists',
  templateUrl: './lists.page.html',
  styleUrls: ['./lists.page.scss'],
})
export class ListsPage implements OnInit {

  lists = [];

  constructor(
    private shoppingService: ShoppingService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.loadLists();
  }

  async loadLists(event?: InfiniteScrollCustomEvent) {
    const loading = await this.loadingCtrl.create({
      message: 'Yükleniyor..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.shoppingService.getShoppingLists().subscribe(
      (res) => {
        loading.dismiss();
        this.lists = [];
        this.lists.push(...res);

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

  async addShoppingList() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Liste Ekle',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Liste adı'
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
        
            this.shoppingService.addShoppingList(event.name).subscribe(
              (res) => {
                loading.dismiss();
                this.loadLists();
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

  async removeShoppingList(id:string) {
    const listId = id;
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Dikkat!',
      message: 'Alışveriş listesi ve içeriğindeki tüm ürünler silinecek. Emin misiniz?',
      buttons: [
        {
          text: 'İptal',
          role: 'cancel',
          cssClass: 'secondary',
          id: 'cancel-button',
          handler: (blah) => {
          }
        }, {
          text: 'Evet',
          id: 'confirm-button',
          handler: (event) => {
            this.deleteList(listId);
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteList(id:string){

    const loading = await this.loadingCtrl.create({
      message: 'Yükleniyor..',
      spinner: 'bubbles',
    });
    await loading.present();

    this.shoppingService.deleteShoppingList(id).subscribe(
      (res) => {
        loading.dismiss();
        this.loadLists();
      },
      (err) => {
        console.log(err);
        loading.dismiss();
      }
    );
  }

}
