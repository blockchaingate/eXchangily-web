import { Component, OnInit, forwardRef, Input } from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from "@angular/forms";

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }] 
})
export class FileUploadComponent implements OnInit, ControlValueAccessor {
  @Input() title: string;
  fileToUpload: any = null;
  constructor() { }

  ngOnInit(): void {
  }

  handleFileInputEvent(event: any) {
    const files = event.target.files;
    this.handleFileInput(files);
  }
  
  handleFileInput(files: FileList) {
    
    const file = files.item(0);
    //console.log('this.fileToUpload===', this.fileToUpload);

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      this.writeValue(reader.result);
    };
  }

  onChange: (_: any) => void = (_: any) => {};
 
  /**
   * Invoked when the model has been touched
   */
  onTouched: () => void = () => {};

  /**
   * Method that is invoked on an update of a model.
   */
  updateChanges() {
      this.onChange(this.fileToUpload);
  }


  ///////////////
  // OVERRIDES //
  ///////////////

  /**
   * Writes a new item to the element.
   * @param value the value
   */
  writeValue(value: any): void {
      this.fileToUpload = value;
      this.updateChanges();
  }

  /**
   * Registers a callback function that should be called when the control's value changes in the UI.
   * @param fn
   */
  registerOnChange(fn: any): void {
      this.onChange = fn;
  }


  /**
   * Registers a callback function that should be called when the control receives a blur event.
   * @param fn
   */
  registerOnTouched(fn: any): void {
      this.onTouched = fn;
  }  
}
