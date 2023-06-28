import { TestBed } from '@angular/core/testing';
import { Store } from '@ngxs/store';
import { MockStore } from '../lib/mock-store';
import { ORIGINAL_STORE } from '../lib/original-store';
import { NgxsTestingModule, provideNgxsTesting } from '../lib/providers';

describe('provideNgxsTesting', () => {
  it("should add all providers from ngxs besides 'Store'", () => {
    TestBed.configureTestingModule({ providers: [provideNgxsTesting()] });

    expect(TestBed.inject(Store)).toBeInstanceOf(MockStore);

    expect(() => TestBed.inject(ORIGINAL_STORE)).not.toThrow();

    expect(TestBed.inject(ORIGINAL_STORE)).toBeInstanceOf(Store);
  });

  it('should optionally add a default state', () => {
    const someState = { foo: '42' };

    TestBed.configureTestingModule({
      providers: [provideNgxsTesting(undefined, undefined, someState)],
    });

    expect(TestBed.inject(Store).snapshot()).toEqual(someState);
  });

  it('should be compatible with ngModules', () => {
    TestBed.configureTestingModule({
      imports: [NgxsTestingModule.forRoot()],
    });

    expect(TestBed.inject(Store)).toBeInstanceOf(MockStore);

    expect(TestBed.inject(ORIGINAL_STORE)).toBeInstanceOf(Store);
  });
});
