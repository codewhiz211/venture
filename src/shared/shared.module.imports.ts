import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';

import { CommonModule } from '@angular/common';
import { EcoFabSpeedDialModule } from '@ecodev/fab-speed-dial';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { SignaturePadModule } from 'angular2-signaturepad';

export const angularMaterialModules = [
  MatAutocompleteModule,
  MatButtonModule,
  MatCheckboxModule,
  MatMenuModule,
  MatInputModule,
  MatSnackBarModule,
  MatToolbarModule,
  MatDialogModule,
  MatSidenavModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatCardModule,
  MatBadgeModule,
  MatFormFieldModule,
  MatTabsModule,
  MatIconModule,
  MatBottomSheetModule,
  MatTableModule,
  MatPaginatorModule,
  MatExpansionModule,
  MatSelectModule,
  MatChipsModule,
  MatRadioModule,
  MatTableModule,
  MatSortModule,
];

export const angularModules = [CommonModule, FormsModule, ReactiveFormsModule, RouterModule];

export const thirdPartyModules = [EcoFabSpeedDialModule, SignaturePadModule, LoggerModule.forRoot({ level: NgxLoggerLevel.ERROR })];
