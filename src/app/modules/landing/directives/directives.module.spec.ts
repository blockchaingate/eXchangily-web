import { DirectivesModule } from './directives.module';

describe('DirectivesModule', () => {
  let directivesModule: DirectivesModule;

  beforeEach(() => {
    directivesModule = new DirectivesModule();
  });

  it('should create an instance', () => {
    expect(directivesModule).toBeTruthy();
  });
});
