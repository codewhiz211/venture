import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { DialogService } from '@shell/dialogs/dialog.service';
import { FolderService } from 'src/+files/src/services/folder.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PricingService } from '@services/spec/pricing.service';
import { SpecFormatterService } from '@services/spec/spec.formatter.service';
import { sectionConfig } from '@shared/config/spec-config';

@Component({
  selector: 'ven-request-pricing',
  templateUrl: './request-pricing.component.html',
  styleUrls: ['./request-pricing.component.scss'],
})
export class RequestPricingComponent implements OnInit {
  @Input() data;
  public requestForm;
  public sections;
  public currentOptions;
  public showValue = false;
  public folder = 'Pricing uploads';
  private currentSection;

  public uploading = false;
  public uploadedFiles = [];

  public submitAction = {
    label: 'REQUEST',
    handler: () => this.onRequestPricing(),
  };

  public closeAction = {
    label: 'CANCEL',
    handler: () => this.onCancelClick(),
  };

  constructor(
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    private specFormatterService: SpecFormatterService,
    private folderService: FolderService,
    private pricingService: PricingService,
    private snackBar: MatSnackBar
  ) {
    this.requestForm = this.formBuilder.group({
      section: ['', Validators.required],
      field: ['N/A', Validators.required],
      value: ['', Validators.required],
      details: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.sections = this.specFormatterService
      .combineUserAndDefinedSections(this.data.spec, sectionConfig)
      .map((section) => {
        return { name: section.name, title: section.title, fields: section.fields };
      })
      .filter((section) => !['contact_details', 'section_details', 'planning'].includes(section.name));
    this.currentSection = this.data.section;
    this.currentOptions = this.getOptionsUnderSection(this.currentSection);

    this.requestForm.patchValue({ section: this.currentSection.name });
  }

  sectionChanged($event) {
    this.currentSection = this.sections.find((section) => section.name == $event.value);
    this.currentOptions = this.getOptionsUnderSection(this.currentSection);
  }

  optionChanged($event) {
    if ($event.value == 'N/A') {
      this.showValue = false;
    } else {
      this.showValue = true;
    }
  }

  private onRequestPricing() {
    const request = this.requestForm.value;
    if (this.uploadedFiles.length > 0) {
      request.attachment = this.uploadedFiles;
    }
    if (request.field == 'N/A') {
      delete request.value;
    }
    this.pricingService.requestPricing(request, this.data.spec.uid, this.data.spec.details.status).subscribe((result) => {
      this.snackBar.open('Pricing request sent');
      this.onCancelClick();
    });
  }

  private onCancelClick() {
    this.requestForm.reset();
    this.dialogService.closeActiveDialog();
  }

  public handleUploading(data) {
    this.uploading = data;
  }

  public handleUploaded(data) {
    this.uploading = false;
    this.uploadedFiles = [...this.uploadedFiles, ...data];
    this.folderService.addFolder(this.data.spec.uid, this.folder);
  }

  private getOptionsUnderSection(section) {
    return [{ display: 'N/A', name: 'N/A' }, ...this.getOption(section.fields)];
  }

  private getOption(fields): [] {
    let options = fields
      .filter((field) => field.type == 'dropdown' || field.type == 'image-picker')
      .map((field) => {
        return {
          name: field.name,
          display: field.display,
        };
      });
    fields
      .filter((field) => field.blockFields)
      .forEach((field) => {
        const subOptions = this.getOption(field.blockFields);
        options = [...options, ...subOptions];
      });
    return options;
  }
}
