import { Component } from '@angular/core';
import { ProfileService } from './../profile.service';
import { InputService } from './../input.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page {

  title = "Eye Profile"

  profile_info = [];
  errorMessage: string;

  constructor(public dataService: ProfileService, public InputService: InputService, public toastController: ToastController) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.load_profile();
    });
  }

  // Call to load profile on app start
  ngOnInit() {
    console.log("Page loading...")
    this.load_profile();
  }
  
  // Implementation/interface for loading a profile
  load_profile(){
    this.dataService.get_profile_info()
      .subscribe(
        profile_info => this.profile_info = profile_info,
        error => this.errorMessage = <any>error);
  }

  // Implementation/interface for creating a profile
  async add_profile(){
    console.log("Creating New Profile");
    this.InputService.profile_prompt()
  }

  // Implementation/interface for editing a profile
  async edit_profile(profile, index){
    console.log("Editing Profile Info");
    const toast = await this.toastController.create({
      message: "Editing Profile Info",
      duration: 3000
    });
    toast.present();
    this.InputService.profile_prompt(profile, index)
  }

  // Implementation/interface for deleting a profile
  async deleting_profile(profile){
    this.InputService.delete_confirm(profile);
  }
  
}
