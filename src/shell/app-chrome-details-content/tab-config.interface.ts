import { Component } from '@angular/core';

export interface TabConfig {
  label: string;
  component: Component;
  data: any;
  id: string;
}
