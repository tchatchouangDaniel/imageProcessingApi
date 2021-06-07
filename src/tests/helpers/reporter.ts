/* eslint-disable import/no-extraneous-dependencies */
import {
  DisplayProcessor,
  SpecReporter,
  StacktraceOption,
} from 'jasmine-spec-reporter';
// eslint-disable-next-line no-undef
import SuiteInfo = jasmine.SuiteInfo;

class CustomProcessor extends DisplayProcessor {
  // eslint-disable-next-line class-methods-use-this
  public displayJasmineStarted(_info: SuiteInfo, log: string): string {
    return `${log}`;
  }
}

// eslint-disable-next-line no-undef
jasmine.getEnv().clearReporters();
// eslint-disable-next-line no-undef
jasmine.getEnv().addReporter(
  new SpecReporter({
    spec: {
      displayStacktrace: StacktraceOption.NONE,
    },
    customProcessors: [CustomProcessor],
  }),
);
