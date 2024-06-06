import Framework from './framework';

function getFindString(foundBy, value) {
  switch (foundBy) {
    case 'byValueKey':
      return `find.byKey(const Key('${value}'))`;
    case 'byType':
      return `find.${foundBy}(${value})`;
    case 'byText':
      return `find.widgetWithText('${value}')`;
    case 'byTooltip':
      return `find.${foundBy}('${value}')`;
    default:
      return `find.${foundBy}('${value}')`;
  }
}

class DartFramework extends Framework {
  get language() {
    return 'dart';
  }

  wrapWithBoilerplate(code) {
    return `import 'dart:developer';
    
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart' as ft;
import 'package:your_package_name/main.dart';
import 'package:integration_test/integration_test.dart';

void main() {
  group('end-to-end test', () {
    testWidgets('tap on the floating action button, verify counter',
      (tester) async {
      // Load app widget.
      await tester.pumpWidget(MyApp());

      // start test code




      // end test code
    });
  });
}`;
  }

  addComment(comment) {
    return `// ${comment}`;
  }

  codeFor_findAndAssign(strategy, locator, localVar, isArray) {
    // wdio allows to specify strategy as a locator prefix
    const validStrategies = [
      'xpath',
      'accessibility id',
      'id',
      'class name',
      'name',
      '-android uiautomator',
      '-android datamatcher',
      '-android viewtag',
      '-ios predicate string',
      '-ios class chain',
    ];
    if (!validStrategies.includes(strategy)) {
      return this.handleUnsupportedLocatorStrategy(strategy, locator);
    }
    if (isArray) {
      return `const ${localVar} = await driver.$$(${JSON.stringify(`${strategy}:${locator}`)});`;
    } else {
      return `const ${localVar} = await driver.$(${JSON.stringify(`${strategy}:${locator}`)});`;
    }
  }

  codeFor_text(varName, varIndex, pointerActions) {
    const {x, y, text, foundBy, value} = this.getEnterTextFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `await tester.enterText(${find}, '${text}');
await tester.pumpAndSettle();`;
    } else {
      return '';
    }
  }

  codeFor_check(varName, varIndex, pointerActions) {
    const {x, y, text, foundBy, value} = this.getCheckTextFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `expect(${find}, '${text}');`;
    } else {
      return '';
    }
  }

  codeFor_click(varName, varIndex) {
    return `await ${this.getVarName(varName, varIndex)}.click();`;
  }

  codeFor_clear(varName, varIndex) {
    return `await ${this.getVarName(varName, varIndex)}.clearValue();`;
  }

  codeFor_sendKeys(varName, varIndex, text) {
    return `await ${this.getVarName(varName, varIndex)}.addValue(${JSON.stringify(text)});`;
  }

  codeFor_tap(varNameIgnore, varIndexIgnore, pointerActions) {
    const {x, y, foundBy, value} = this.getTapCoordinatesFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `await tester.tap(${find});
await tester.pumpAndSettle();`;
    } else {
      return '';
    }
  }

  codeFor_swipe(varNameIgnore, varIndexIgnore, pointerActions) {
    const {x1, y1, x2, y2, foundBy, value} = this.getSwipeCoordinatesFromPointerActions(pointerActions);
    if (foundBy && value) {
      return `await tester.drag(${find}, const Offset(${x2}, ${y2}));
await tester.pumpAndSettle();`;
        } else {
      return `await driver.touchAction([
  { action: 'press', x: ${x1}, y: ${y1} },
  { action: 'moveTo', x: ${x2}, y: ${y2} },
  'release'
]);`;
    }
  }

  // Execute Script

  codeFor_executeScriptNoArgs(scriptCmd) {
    return `await driver.executeScript(${JSON.stringify(scriptCmd)});`;
  }

  codeFor_executeScriptWithArgs(scriptCmd, jsonArg) {
    return `await driver.executeScript(${JSON.stringify(scriptCmd)}, ${JSON.stringify(jsonArg)});`;
  }

  // App Management

  codeFor_getCurrentActivity() {
    return `let activityName = ${this.codeFor_executeScriptNoArgs('mobile: getCurrentActivity')}`;
  }

  codeFor_getCurrentPackage() {
    return `let packageName = ${this.codeFor_executeScriptNoArgs('mobile: getCurrentPackage')}`;
  }

  codeFor_installApp(varNameIgnore, varIndexIgnore, app) {
    return `await driver.installApp("${app}");`;
  }

  codeFor_isAppInstalled(varNameIgnore, varIndexIgnore, app) {
    return `let isAppInstalled = await driver.isAppInstalled("${app}");`;
  }

  codeFor_activateApp(varNameIgnore, varIndexIgnore, app) {
    return `await driver.activateApp("${app}");`;
  }

  codeFor_terminateApp(varNameIgnore, varIndexIgnore, app) {
    return `await driver.terminateApp("${app}");`;
  }

  codeFor_removeApp(varNameIgnore, varIndexIgnore, app) {
    return `await driver.removeApp("${app}")`;
  }

  codeFor_getStrings(varNameIgnore, varIndexIgnore, language, stringFile) {
    return `let appStrings = await driver.getStrings(${language ? `"${language}", ` : ''}${
      stringFile ? `"${stringFile}"` : ''
    });`;
  }

  // Clipboard

  codeFor_getClipboard() {
    return `let clipboardText = await driver.getClipboard();`;
  }

  codeFor_setClipboard(varNameIgnore, varIndexIgnore, clipboardText) {
    return `await driver.setClipboard("${clipboardText}")`;
  }

  // File Transfer

  codeFor_pushFile(varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return `await driver.pushFile("${pathToInstallTo}", "${fileContentString}");`;
  }

  codeFor_pullFile(varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return `let fileBase64 = await driver.pullFile("${pathToPullFrom}");`;
  }

  codeFor_pullFolder(varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return `let folderBase64 = await driver.pullFolder("${folderToPullFrom}");`;
  }

  // Device Interaction

  codeFor_isLocked() {
    return `let isLocked = ${this.codeFor_executeScriptNoArgs('mobile: isLocked')}`;
  }

  codeFor_rotateDevice(
    varNameIgnore,
    varIndexIgnore,
    x,
    y,
    radius,
    rotation,
    touchCount,
    duration,
  ) {
    return `await driver.rotateDevice(${x}, ${y}, ${radius}, ${rotation}, ${touchCount}, ${duration});`;
  }

  codeFor_touchId(varNameIgnore, varIndexIgnore, match) {
    return `await driver.touchId(${match});`;
  }

  codeFor_toggleEnrollTouchId(varNameIgnore, varIndexIgnore, enroll) {
    return `await driver.toggleEnrollTouchId(${enroll});`;
  }

  // Keyboard

  codeFor_isKeyboardShown() {
    return `let isKeyboardShown = await driver.isKeyboardShown();`;
  }

  // Connectivity

  codeFor_toggleAirplaneMode() {
    return `await driver.toggleAirplaneMode();`;
  }

  codeFor_toggleData() {
    return `await driver.toggleData();`;
  }

  codeFor_toggleWiFi() {
    return `await driver.toggleWiFi();`;
  }

  codeFor_sendSMS(varNameIgnore, varIndexIgnore, phoneNumber, text) {
    return `await driver.sendSms("${phoneNumber}", "${text}");`;
  }

  codeFor_gsmCall(varNameIgnore, varIndexIgnore, phoneNumber, action) {
    return `await driver.gsmCall("${phoneNumber}", "${action}");`;
  }

  codeFor_gsmSignal(varNameIgnore, varIndexIgnore, signalStrength) {
    return `await driver.gsmSignal("${signalStrength}");`;
  }

  codeFor_gsmVoice(varNameIgnore, varIndexIgnore, state) {
    return `await driver.gsmVoice("${state}");`;
  }

  // Session

  codeFor_getSession() {
    return `let sessionDetails = await driver.getSession();`;
  }

  codeFor_setTimeouts(/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return '/* TODO implement setTimeouts */';
  }

  codeFor_getOrientation() {
    return `let orientation = await driver.getOrientation();`;
  }

  codeFor_setOrientation(varNameIgnore, varIndexIgnore, orientation) {
    return `await driver.setOrientation("${orientation}");`;
  }

  codeFor_getGeoLocation() {
    return `let location = await driver.getGeoLocation();`;
  }

  codeFor_setGeoLocation(varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return `await driver.setGeoLocation({latitude: ${latitude}, longitude: ${longitude}, altitude: ${altitude}});`;
  }

  codeFor_getLogTypes() {
    return `let logTypes = await driver.getLogTypes();`;
  }

  codeFor_getLogs(varNameIgnore, varIndexIgnore, logType) {
    return `let logs = await driver.getLogs("${logType}");`;
  }

  codeFor_updateSettings(varNameIgnore, varIndexIgnore, settingsJson) {
    return `await driver.updateSettings(${JSON.stringify(settingsJson)});`;
  }

  codeFor_getSettings() {
    return `let settings = await driver.getSettings();`;
  }

  // Web

  codeFor_navigateTo(varNameIgnore, varIndexIgnore, url) {
    return `await driver.navigateTo('${url}');`;
  }

  codeFor_getUrl() {
    return `let current_url = await driver.getUrl();`;
  }

  codeFor_back() {
    return `await driver.back();`;
  }

  codeFor_forward() {
    return `await driver.forward();`;
  }

  codeFor_refresh() {
    return `await driver.refresh();`;
  }

  // Context

  codeFor_getContext() {
    return `let context = await driver.getContext();`;
  }

  codeFor_getContexts() {
    return `let contexts = await driver.getContexts();`;
  }

  codeFor_switchContext(varNameIgnore, varIndexIgnore, name) {
    return `await driver.switchContext("${name}");`;
  }
}

DartFramework.readableName = 'Dart - Integration Test';

export default DartFramework;
