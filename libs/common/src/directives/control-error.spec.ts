import { FormControl, Validators } from '@angular/forms';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { ControlError } from './control-error';

describe('ControlError', () => {
  beforeEach(() => MockBuilder(ControlError));

  it('should create an instance', () => {
    MockRender(`<ng-template ngxControlError></ng-template>`);
    expect(ngMocks.reveal(ControlError)).toBeTruthy();
  });

  it('should use micro syntax', () => {
    const params = {
      error: 'required',
      control: new FormControl('', Validators.required),
      stateMatcher: () => true,
    };

    const fixture = MockRender(
      `<span *ngxControlError="error of control as error; errorStateMatcher: stateMatcher">42</span>`,
      // NG100 ffs
      // `<span *ngxControlError="error of control as error; errorStateMatcher: stateMatcher">{{ error }}</span>`,
      params
    );

    expect(ngMocks.formatText(fixture)).toEqual('42');
  });
});
