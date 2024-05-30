export interface IDialogConfig {
  closeButton: boolean;
  dialogComponent: any;
  dialogData: any;
  dataKey: string; // name of input for injected component
  dialogTitle?: string;
}
