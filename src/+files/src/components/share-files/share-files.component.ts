import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

import { AuthService } from '@auth/services/auth.service';
import { DrawerService } from '@shell/drawer/drawer.service';
import { EmailService } from '@services/email.service';
import { FileService } from '../../services/file.service';
import { IDrawerContentComponent } from '@shell/drawer/drawer-content.interfaces';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WindowService } from '@services/window.service';

@Component({
  selector: 'ven-share-files',
  templateUrl: './share-files.component.html',
  styleUrls: ['./share-files.component.scss'],
})
export class ShareFilesComponent implements IDrawerContentComponent, OnInit {
  @Input() data: any;

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private windowService: WindowService,
    private drawerService: DrawerService,
    private emailService: EmailService,
    private fileService: FileService
  ) {}

  public isMobile = false;
  public loading: boolean = true;
  public showEmailForm: boolean = false;
  public clientEmail: string;
  public selectAll: boolean = false;
  public attachedCount = 0;
  public error;

  public attachments: any[] = [];

  description = new FormControl('', [Validators.required]);

  ngOnInit(): void {
    this.isMobile = this.windowService.isMobile;
    this.fileService.getAllFiles(this.data.uid).subscribe((files) => {
      this.cd.markForCheck();
      this.data.files = files;
      this.loading = false;
    });
  }

  getErrorMessage() {
    this.error = this.description.hasError('required') ? 'You must enter a value' : '';
    return this.error;
  }

  onSelectedFilesChanged(files) {
    this.attachments = files;
  }

  onCancelClick() {
    this.drawerService.close();
  }

  onEmailLink() {
    this.clientEmail = this.data.spec.details.email;
    this.showEmailForm = true;
  }

  onFormSubmitted(formValues) {
    this.showEmailForm = false;
    const fromAddress = this.authService.authUser?.email;
    this.sendEmail(fromAddress, formValues);
    this.drawerService.close();
  }

  private sendEmail(fromAddress, formValues) {
    this.snackBar.open(`Emailing files to ${formValues.email}`);

    // creating the download links on the server is problematic
    // so will probably need to do on the client and post to the server
    this.emailService
      .sendShareFilesEmail({
        to: formValues.email,
        from: fromAddress,
        subject: formValues.subject,
        message: formValues.message,
        specId: this.data.spec.uid,
        attachments: this.data.files.filter((file) => file.checked),
      })
      .subscribe(() => {
        this.snackBar.open(`Email sent`, undefined);
      });
  }
}
