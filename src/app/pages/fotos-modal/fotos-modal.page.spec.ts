import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FotosModalPage } from './fotos-modal.page';

describe('FotosModalPage', () => {
  let component: FotosModalPage;
  let fixture: ComponentFixture<FotosModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FotosModalPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FotosModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
