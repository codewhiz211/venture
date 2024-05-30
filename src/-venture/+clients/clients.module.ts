import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CheckboxGroupComponent } from './components/filter-search/checkbox-group/checkbox-group.component';
import { ClientsPageComponent } from './components/clients-page/clients-page.component';
import { ClientsRouting } from './clients.routing';
import { ClientsTableComponent } from './components/clients-table/clients-table.component';
import { CommonModule } from '@angular/common';
import { CreateClientComponent } from './components/create-client/create-client.component';
import { FilterSearchComponent } from './components/filter-search/filter-search.component';
import { FilterService } from './services/filter.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SelectedFiltersLIstComponent } from './components/filter-search/selected-filters-list/selected-filters-list.component';
import { SharedModule } from '@shared/shared.module';
import { ShellModule } from '@shell/shell.module';

//import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ClientsPageComponent,
    ClientsTableComponent,
    FilterSearchComponent,
    CheckboxGroupComponent,
    CreateClientComponent,
    SelectedFiltersLIstComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatChipsModule,
    MatPaginatorModule,
    MatSortModule,
    ShellModule,
    SharedModule,
    ClientsRouting,
  ],
  providers: [FilterService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [],
  entryComponents: [CreateClientComponent],
})
export class ClientsModule {}
