import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedBlogsComponent } from './liked-blogs.component';

describe('LikedBlogsComponent', () => {
  let component: LikedBlogsComponent;
  let fixture: ComponentFixture<LikedBlogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikedBlogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedBlogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
