import DotNetNUnitFramework from './dotnet-nunit';
import JavaJUnit4Framework from './java-junit4';
import JavaJUnit5Framework from './java-junit5';
import JsOxygenFramework from './js-oxygen';
import JsWdIoFramework from './js-wdio';
import PythonFramework from './python';
import RobotFramework from './robot';
import RubyFramework from './ruby';
import DartFramework from './dart-integration-test';

const frameworks = {
  dartFlutter: DartFramework,
  dotNetNUnit: DotNetNUnitFramework,
  jsWdIo: JsWdIoFramework,
  jsOxygen: JsOxygenFramework,
  java: JavaJUnit4Framework,
  javaJUnit5: JavaJUnit5Framework,
  python: PythonFramework,
  ruby: RubyFramework,
  robot: RobotFramework,
};

export default frameworks;
