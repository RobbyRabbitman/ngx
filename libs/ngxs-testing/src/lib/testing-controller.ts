import { Injectable, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TypedSelector } from '@ngxs/store';
import { MockSelector } from './mock-selector';
import { MockSelectors } from './mock-store';

@Injectable()
export class NgxsTestingController {
  private readonly _mockedSelectors = inject(MockSelectors);

  public mock = <T>(selector: TypedSelector<T>): MockSelector<T> =>
    this._mockedSelectors.get<T>(selector);
}

export const mockSelector = <T>(selector: TypedSelector<T>) =>
  TestBed.inject(NgxsTestingController).mock(selector);
