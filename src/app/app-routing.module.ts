import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaptureVoiceComponent } from './capture-voice/capture-voice.component';

const routes: Routes = [
  {
    path:'',
    component: CaptureVoiceComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
