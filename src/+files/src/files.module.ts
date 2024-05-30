// Modules 3rd party
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddChecklistItemDialog } from './components/checklists/checklist/add-checklist-item-dialog/add-checklist-item-dialog.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { AutoFocusDirective } from './directives/autofocus.directive';
import { ChecklistCallComponent } from './components/checklists/checklist/checklist-call/checklist-call.component';
import { ChecklistComponent } from './components/checklists/checklist/checklist.component';
import { ChecklistEmailComponent } from './components/checklists/checklist/checklist-email/checklist-email.component';
import { ChecklistEmailDialogComponent } from './components/checklists/checklist/checklist-email/checklist-email-dialog/checklist-email-dialog.component';
import { ChecklistHeadingComponent } from './components/checklists/checklist/checklist-heading/checklist-heading.component';
import { ChecklistSignComponent } from './components/checklists/checklist/checklist-sign/checklist-sign.component';
import { ChecklistsComponent } from './components/checklists/checklists.component';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { EmailModule } from '../../+email/src/email.module';
import { FileConfirmationDialogComponent } from './components/file-confirmation-dialog/file-confirmation-dialog.component';
import { FileContainerComponent } from './components/files-container/files-container.component';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { FileValidator } from './directives/file-required.validator';
import { FileValueAccessor } from './directives/file-value.accessor';
import { FilesTabContentComponent } from './components/files-tab-content/files-tab-content.component';
import { FolderFileListComponent } from './components/folder-file-list/folder-file-list.component';
import { FolderMenuComponent } from './components/folder-menu/folder-menu.component';
import { FolderService } from './services/folder.service';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RenameFolderComponent } from './components/folder-file-list/rename-folder/rename-folder.component';
import { ShareFilesComponent } from './components/share-files/share-files.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [
    RenameFolderComponent,
    FolderMenuComponent,
    FolderFileListComponent,
    FileContainerComponent,
    FileConfirmationDialogComponent,
    FileUploaderComponent,
    ShareFilesComponent,
    // directives
    AutoFocusDirective,
    FileValueAccessor,
    FileValidator,
    ChecklistsComponent,
    ChecklistComponent,
    ChecklistCallComponent,
    ChecklistHeadingComponent,
    AddChecklistItemDialog,
    ChecklistEmailComponent,
    ChecklistEmailDialogComponent,
    ChecklistSignComponent,
    FilesTabContentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatDialogModule,
    MatBottomSheetModule,
    MatCardModule,
    MatIconModule,
    MatListModule,
    MatRadioModule,
    MatProgressBarModule,
    DragDropModule,
    EmailModule,
    AngularEditorModule,
    SharedModule,
  ],
  providers: [FolderService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [FileContainerComponent, FileUploaderComponent, ChecklistCallComponent, ChecklistHeadingComponent, FilesTabContentComponent],
  entryComponents: [FileConfirmationDialogComponent, ShareFilesComponent, AddChecklistItemDialog, ChecklistEmailDialogComponent],
})
export class FilesModule {}
