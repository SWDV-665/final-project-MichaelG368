import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ProfileService } from './profile.service';

@Injectable({
  providedIn: 'root'
})
export class InputService {

  constructor(public alertController: AlertController, public dataService: ProfileService) {}

  // Prompt used for creating/editing a profile
  async profile_prompt(profile?, index?){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: profile ? 'Edit Profile': 'Create Profile',
      message: profile ? "Please update profile details." : "Please input profile details.",
      inputs: [
        {
          name: 'od',
          type: 'text',
          placeholder: 'O.D. (If Applicable)',
          value: profile ? profile.od: null
        },
        {
          name: 'os',
          type: 'text',
          placeholder: 'O.S. (If Applicable)',
          value: profile ? profile.os: null
        },
        {
          name: 'gp',
          type: 'text',
          placeholder: 'Doctor Info (GP)',
          value: profile ? profile.gp: null
        },
        {
          name: 'opto',
          type: 'text', 
          placeholder: 'Optometrist Info (If Applicable)',
          value: profile ? profile.opto: null
        },
        {
          name: 'conditions',
          type: 'text', 
          placeholder: 'Conditions (If Applicable)',
          value: profile ? profile.conditions: null
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Save',
          handler: data => {
            console.log('Save Handler ', data);
            if (index !== undefined) {
              profile.od = data.od;
              profile.os = data.os;
              profile.gp = data.gp;
              profile.opto = data.opto;
              profile.conditions = data.conditions;
              this.dataService.edit_profile(profile, index);
            }
            else{
              this.dataService.create_profile(data);
            }
          }
        }
      ]
    });
    await alert.present();
  }

  // Prompt used to confirm profile deletion
  async delete_confirm(profile){
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete Profile',
      message: "Are you sure you want to delete your profile?",
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: data => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: data => {
            this.dataService.deleting_profile(profile);
            }
          }
      ]
    });
    await alert.present();
  }

}
