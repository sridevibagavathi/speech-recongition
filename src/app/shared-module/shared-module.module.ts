import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatTimePipe } from '../core/_pipes/format-time.pipe';

@NgModule({
  declarations: [
    FormatTimePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [FormatTimePipe], // <--- Pipes
})
export class SharedModuleModule { }
