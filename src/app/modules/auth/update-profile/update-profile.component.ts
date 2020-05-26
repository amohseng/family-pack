import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Observable, Subject} from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  unsubscribe = new Subject<void>();
  uploadPercent: Observable<number>;
  isWaiting = false;
  isUploading = false;
  user: User;
  constructor(private router: Router, private storage: AngularFireStorage, private snackBar: MatSnackBar,
              private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userChange.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.user = user;
    });
  }

  uploadFile(event) {
    if (event.target.files && event.target.files.length > 0) {
      this.isUploading = true;
      const file: File = event.target.files[0];
      if (file.type.split('/')[0] !== 'image') {
        this.snackBar.open('Unsupported file type', 'Ok', {
          duration: 10000
        });
        return;
      }
      this.resize(file, 200).then(resizedFile => {
        this.upload(resizedFile);
      });
    }
  }

  resize(file: File, width: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataURL = e.target.result.toString();
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        const img = new Image();

        img.onload = () => {
          const height = (width * img.height) / img.width ;
          c.width = width;
          c.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          resolve(this.dataURItoBlob(c.toDataURL()));
        };
        img.src = dataURL;
      };
      reader.readAsDataURL(file);
    });
  }

  upload(file: Blob) {
    const now = (new Date()).toUTCString();
    const filePath = `img/profiles/${this.user.id}/${now}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();

    // get notified when the download URL is available
    task.snapshotChanges()
      .pipe(
        finalize(() => {
          const reader = new FileReader();
          reader.onload = () => {
            this.user.photoURL = reader.result.toString();
          };
          reader.readAsDataURL(file);
          fileRef.getDownloadURL().subscribe((url) => {
            this.user.photoURL = url;
            this.isUploading = false;
          });
        })
      )
      .subscribe();
  }

  dataURItoBlob(dataURI: string): Blob {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }

    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type: mimeString});
}

  async updateProfile(form: NgForm) {
    if (form.valid) {
      if (this.user.displayName !== '' && this.user.photoURL !== '') {
        try {
          this.isWaiting = true;
          await this.authService.updateUser(this.user);
          this.router.navigate(['/']);
        } catch (error) {
          console.log(error);
          this.snackBar.open(error.message, 'Ok', {
            duration: 10000
          });
        } finally {
          this.isWaiting = false;
        }
      }
    }
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

}
