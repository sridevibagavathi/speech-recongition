import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaptureVoiceComponent } from './capture-voice.component';

describe('CaptureVoiceComponent', () => {
  let component: CaptureVoiceComponent;
  let fixture: ComponentFixture<CaptureVoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaptureVoiceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaptureVoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
