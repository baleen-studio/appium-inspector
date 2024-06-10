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
    testWidgets('your comment for this test',
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
    return this.addComment('findAndAssign not supported');
  }

  codeFor_text(varName, varIndex, pointerActions) {
    const {x, y, text, foundBy, value} = this.getEnterTextFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `await tester.enterText(${find}, '${text}');
await tester.pumpAndSettle();`;
    } else {
      return this.addComment('Could not get element information');
    }
  }

  codeFor_check(varName, varIndex, pointerActions) {
    const {x, y, text, foundBy, value} = this.getCheckTextFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `expect(${find}, '${text}');`;
    } else {
      return this.addComment('Could not get element information');
    }
  }

  codeFor_existence(varName, varIndex, pointerActions) {
    const {x, y, text, foundBy, value} = this.getCheckExistenceFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `expect(${find}, findsOneWidget);`;
    } else {
      return this.addComment('Could not get element information');
    }
  }

  codeFor_click(varName, varIndex) {
    return this.addComment('click not supported');
  }

  codeFor_clear(varName, varIndex) {
    return this.addComment('clear ot supported');
  }

  codeFor_sendKeys(varName, varIndex, text) {
    return this.addComment('sendKeys not supported');
  }

  codeFor_tap(varNameIgnore, varIndexIgnore, pointerActions) {
    const {x, y, foundBy, value} = this.getTapCoordinatesFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
      const find = getFindString(foundBy, value);
      return `await tester.tap(${find});
await tester.pumpAndSettle();`;
    } else {
      return this.addComment('Could not get element information');
    }
  }

  codeFor_swipe(varNameIgnore, varIndexIgnore, pointerActions) {
    const {x1, y1, x2, y2, foundBy, value} = this.getSwipeCoordinatesFromPointerActions(pointerActions);
    if (!!foundBy && !!value) {
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
    return this.addComment('executeScriptNoArgs not supported');
  }

  codeFor_executeScriptWithArgs(scriptCmd, jsonArg) {
    return this.addComment('executeScriptWithArgs not supported');
  }

  // App Management

  codeFor_getCurrentActivity() {
    return this.addComment('getCurrentActivity not supported');
  }

  codeFor_getCurrentPackage() {
    return this.addComment('getCurrentPackage not supported');
  }

  codeFor_installApp(varNameIgnore, varIndexIgnore, app) {
    return this.addComment('installApp not supported');
  }

  codeFor_isAppInstalled(varNameIgnore, varIndexIgnore, app) {
    return this.addComment('isAppInstalled not supported');
  }

  codeFor_activateApp(varNameIgnore, varIndexIgnore, app) {
    return this.addComment('activateApp not supported');
  }

  codeFor_terminateApp(varNameIgnore, varIndexIgnore, app) {
    return this.addComment('terminateApp not supported');
  }

  codeFor_removeApp(varNameIgnore, varIndexIgnore, app) {
    return this.addComment('removeApp not supported');
  }

  codeFor_getStrings(varNameIgnore, varIndexIgnore, language, stringFile) {
    return this.addComment('getStrings not supported');
  }

  // Clipboard

  codeFor_getClipboard() {
    return this.addComment('getClipboard not supported');
  }

  codeFor_setClipboard(varNameIgnore, varIndexIgnore, clipboardText) {
    return this.addComment('setClipboard not supported');
  }

  // File Transfer

  codeFor_pushFile(varNameIgnore, varIndexIgnore, pathToInstallTo, fileContentString) {
    return this.addComment('pushFile not supported');
  }

  codeFor_pullFile(varNameIgnore, varIndexIgnore, pathToPullFrom) {
    return this.addComment('pullFile not supported');
  }

  codeFor_pullFolder(varNameIgnore, varIndexIgnore, folderToPullFrom) {
    return this.addComment('pullFolder not supported');
  }

  // Device Interaction

  codeFor_isLocked() {
    return this.addComment('isLocked not supported');
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
    return this.addComment('rotateDevice not supported');
  }

  codeFor_touchId(varNameIgnore, varIndexIgnore, match) {
    return this.addComment('touchId not supported');
  }

  codeFor_toggleEnrollTouchId(varNameIgnore, varIndexIgnore, enroll) {
    return this.addComment('toggleEnrollTouchId not supported');
  }

  // Keyboard

  codeFor_isKeyboardShown() {
    return this.addComment('isKeyboardShown not supported');
  }

  // Connectivity

  codeFor_toggleAirplaneMode() {
    return this.addComment('toggleAirplaneMode not supported');
  }

  codeFor_toggleData() {
    return this.addComment('toggleData not supported');
  }

  codeFor_toggleWiFi() {
    return this.addComment('toggleWiFi not supported');
  }

  codeFor_sendSMS(varNameIgnore, varIndexIgnore, phoneNumber, text) {
    return this.addComment('sendSMS not supported');
  }

  codeFor_gsmCall(varNameIgnore, varIndexIgnore, phoneNumber, action) {
    return this.addComment('gsmCall not supported');
  }

  codeFor_gsmSignal(varNameIgnore, varIndexIgnore, signalStrength) {
    return this.addComment('gsmSignal not supported');
  }

  codeFor_gsmVoice(varNameIgnore, varIndexIgnore, state) {
    return this.addComment('gsmVoice not supported');
  }

  // Session

  codeFor_getSession() {
    return this.addComment('getSession not supported');
  }

  codeFor_setTimeouts(/*varNameIgnore, varIndexIgnore, timeoutsJson*/) {
    return this.addComment('setTimeouts not supported');
  }

  codeFor_getOrientation() {
    return this.addComment('getOrientation not supported');
  }

  codeFor_setOrientation(varNameIgnore, varIndexIgnore, orientation) {
    return this.addComment('setOrientation not supported');
  }

  codeFor_getGeoLocation() {
    return this.addComment('getGeoLocation not supported');
  }

  codeFor_setGeoLocation(varNameIgnore, varIndexIgnore, latitude, longitude, altitude) {
    return this.addComment('setGeoLocation not supported');
  }

  codeFor_getLogTypes() {
    return this.addComment('getLogType not supported');
  }

  codeFor_getLogs(varNameIgnore, varIndexIgnore, logType) {
    return this.addComment('getLogs not supported');
  }

  codeFor_updateSettings(varNameIgnore, varIndexIgnore, settingsJson) {
    return this.addComment('updateSettings not supported');
  }

  codeFor_getSettings() {
    return this.addComment('getSettings not supported');
  }

  // Web

  codeFor_navigateTo(varNameIgnore, varIndexIgnore, url) {
    return this.addComment('navigateTo not supported');
  }

  codeFor_getUrl() {
    return this.addComment('getUrl not supported');
  }

  codeFor_back() {
    return `await tester.pageBack();`;
  }

  codeFor_forward() {
    return this.addComment('forward not supported');
  }

  codeFor_refresh() {
    return this.addComment('refresh not supported');
  }

  // Context

  codeFor_getContext() {
    return this.addComment('getContext not supported');
  }

  codeFor_getContexts() {
    return this.addComment('getContexts not supported');
  }

  codeFor_switchContext(varNameIgnore, varIndexIgnore, name) {
    return this.addComment('switchContext not supported');
  }
}

DartFramework.readableName = 'Dart - Integration Test';

export default DartFramework;
