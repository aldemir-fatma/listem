import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  credentials: FormGroup;
 
  constructor(
    private authService: AuthenticationService,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,
    private fb: FormBuilder
  ) {}
 
  ngOnInit() {
    this.credentials = this.fb.group({
      username: ['bbb', [Validators.required]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
      email: ['bbb@gmail.com', [Validators.required]],
      name: ['bbb', [Validators.required]],
    });
  }
 
  async signup() {
    const loading = await this.loadingController.create();
    await loading.present();
    
    this.authService.signup(this.credentials.value).subscribe(
      async (res) => {
        await loading.dismiss();        
        this.router.navigateByUrl('/lists', { replaceUrl: true });
      },
      async (res) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Giriş Başarısız',
          message: res.error.error,
          buttons: ['OK'],
        });
 
        await alert.present();
      }
    );
  }
 
  // Easy access for form fields
  get username() {
    return this.credentials.get('username');
  }
  
  get password() {
    return this.credentials.get('password');
  }

}
