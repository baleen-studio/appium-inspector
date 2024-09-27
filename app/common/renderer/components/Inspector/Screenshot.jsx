import {Spin} from 'antd';
import React, {Fragment, useRef, useState, useCallback, useMemo} from 'react';

import {GESTURE_ITEM_STYLES, POINTER_TYPES, TEXT_TYPES} from '../../constants/gestures';
import {DEFAULT_SWIPE, DEFAULT_TAP, SCREENSHOT_INTERACTION_MODE, DEFAULT_TEXT, DEFAULT_CHECK, DEFAULT_EXISTENCE} from '../../constants/screenshot';
import TextCheckDialog from './TextCheckDialog';
import TextEnterDialog from './TextEnterDialog';
import ConfirmExistanceDialog from './ConfirmExistenceDialog';
import {INSPECTOR_TABS} from '../../constants/session-inspector';
import HighlighterRects from './HighlighterRects.jsx';
import styles from './Inspector.module.css';
import CheckableTag from 'antd/lib/tag/CheckableTag';
const {POINTER_UP, POINTER_DOWN, PAUSE, POINTER_MOVE, FOUND_BY} = POINTER_TYPES;
const {ENTER_TEXT, CHECK_TEXT, CHECK_EXISTENCE} = TEXT_TYPES;
const {TAP, SELECT, SWIPE, TAP_SWIPE, TEXT, CHECK, EXISTENCE} = SCREENSHOT_INTERACTION_MODE;
const { ipcRenderer } = require('electron');
//const prompt = require('electron-prompt');

/**
 * Shows screenshot of running application and divs that highlight the elements' bounding boxes
 */

const Screenshot = (props) => {
  const {
    driver,
    screenshot,
    mjpegScreenshotUrl,
    methodCallInProgress,
    screenshotInteractionMode,
    coordStart,
    coordEnd,
    clearCoordAction,
    scaleRatio,
    selectedTick,
    selectedInspectorTab,
    applyClientMethod,
    t,
  } = props;

  const containerEl = useRef();
  const enterWidget = useRef(false);
  const checkWidget = useRef(false);
  const [x, setX] = useState();
  const [y, setY] = useState();
  const [clickX, setClickX] = useState();
  const [clickY, setClickY] = useState();
  const [checkVisible, setCheckVisible] = useState(false);
  const [enterVisible, setEnterVisible] = useState(false);
  const [existenceVisible, setExistenceVisible] = useState(false);
  const [checkText, setCheckText] = useState('');
  const [enterText, setEnterText] = useState('');
  const [date,setDate] = useState(new Date());
  const [forceRenderKey, setForceRenderKey] = useState(0);

  ipcRenderer.on('get-automation-name', async (e, m) => {
    //e.sender.send('automation-name', driver.client.capabilities.automationName);
    ipcRenderer.send('automation-name', driver.client.capabilities.automationName);
  });

  ipcRenderer.once('check-dialog',  async (e, m) => {
    if (!checkVisible) {
      const {setCoordEnd, clearCoordAction} = props;
      //if (!clickX || !clickY) {
        await setCoordEnd(x, y);
        await setClickX(x);
        await setClickY(y);
        await setCheckVisible(true);
        clearCoordAction();
      //}
    }
  });

  setInterval(async () => {
    if (checkVisible && !checkWidget.current) {
      checkWidget.current = true;
      try {
        const params = JSON.stringify({"x":clickX,"y":clickY});
        const element = await driver.executeScript('flutter:requestData', [`findByPosition:${params}`]);
        const result = JSON.parse(element.response.message);
        setCheckText(result.text);
        setForceRenderKey(prevKey => prevKey + 1);
      } catch (err) {
        console.log(err);
      }
    }
  }, 100);

  const handleCloseCheck = async (check, text) => {
    setCheckVisible(false);
    setCheckText(text);
    checkWidget.current = false;
    if (check) {
      const {DATA_TYPE} = DEFAULT_CHECK;
      const {DURATION_1} = DEFAULT_TAP;
      applyClientMethod({
        methodName: CHECK,
        args: [
          {
            [DATA_TYPE]: [
              {type: POINTER_MOVE, duration: DURATION_1, x: clickX, y: clickY},
              {type: CHECK_TEXT, text: text},
              {foundBy: '', value: ''},
            ],
          },
        ],
      });
      setClickX(undefined);
      setClickY(undefined);
    }
  };

  ipcRenderer.once('enter-dialog',  async (e, m) => {
    if (!enterVisible) {
      const {setCoordEnd, clearCoordAction} = props;
      //if (!clickX || !clickY) {
        await setCoordEnd(x, y);
        await setClickX(x);
        await setClickY(y);
        await setEnterVisible(true);
        //await setEnterText('abc123');
        clearCoordAction();
      //}
    }
  });

  setInterval(async () => {
    if (enterVisible && !enterWidget.current) {
      enterWidget.current = true;
      try {
        const params = JSON.stringify({"x":clickX,"y":clickY});
        const element = await driver.executeScript('flutter:requestData', [`findByPosition:${params}`]);
        const result = JSON.parse(element.response.message);
        setEnterText(result.text);
        setForceRenderKey(prevKey => prevKey + 1);
      } catch (err) {
        console.log(err);
      }
    }
  }, 100);

  const handleCloseEnter = async (check, text) => {
    setEnterVisible(false);
    setEnterText(text);
    enterWidget.current = false;
    if (check) {
      const {POINTER_NAME, DURATION_1, DURATION_2, BUTTON} = DEFAULT_TAP;
      const {DATA_TYPE} = DEFAULT_TEXT;
      const commandRes = await applyClientMethod({
        methodName: TAP,
        args: [
          {
            [POINTER_NAME]: [
              {type: POINTER_MOVE, duration: DURATION_1, x: clickX, y: clickY},
              {type: POINTER_DOWN, button: BUTTON},
              {type: PAUSE, duration: DURATION_2},
              {type: POINTER_UP, button: BUTTON},
              {foundBy: '', value: ''},
            ],
          },
        ],
      });
      await applyClientMethod({
        methodName: TEXT,
        args: [
          {
            [DATA_TYPE]: [
              {type: POINTER_MOVE, duration: DURATION_1, x: clickX, y: clickY},
              {type: ENTER_TEXT, text: text},
              {foundBy: '', value: ''},
            ],
          },
        ],
      });
    }
  };

  ipcRenderer.once('check-existence',  async (e, m) => {
    if (!existenceVisible) {
      const {setCoordEnd, clearCoordAction} = props;
      //if (!clickX || !clickY) {
        await setCoordEnd(x, y);
        await setClickX(x);
        await setClickY(y);
        await setExistenceVisible(true);
        clearCoordAction();
      //}
    }
  });

  const handleCloseExistence = async (check) => {
    setExistenceVisible(false);
    if (check) {
      const {DATA_TYPE} = DEFAULT_EXISTENCE;
      const {DURATION_1} = DEFAULT_TAP;
      applyClientMethod({
        methodName: EXISTENCE,
        args: [
          {
            [DATA_TYPE]: [
              {type: POINTER_MOVE, duration: DURATION_1, x: clickX, y: clickY},
              {type: CHECK_EXISTENCE, text: ''},
              {foundBy: '', value: ''},
            ],
          },
        ],
      });
    }
  }

  const handleScreenshotClick = async () => {
    const {tapTickCoordinates} = props;
    if (selectedTick) {
      await tapTickCoordinates(x, y);
    }
  };

  const handleScreenshotDown = async () => {
    const {setCoordStart} = props;
    if (screenshotInteractionMode === TAP_SWIPE) {
      await setCoordStart(x, y);
      await setDate(new Date());
    }
  };

  const handleScreenshotUp = async () => {
    const {setCoordEnd, clearCoordAction} = props;
    if (screenshotInteractionMode === TAP_SWIPE) {
      await setCoordEnd(x, y);
      var commandRes;
      if (Math.abs(coordStart.x - x) < 5 && Math.abs(coordStart.y - y) < 5) {
        commandRes = await handleDoTap({x, y}); // Pass coordEnd because otherwise it is not retrieved
      } else {
        commandRes = await handleDoSwipe({x, y}); // Pass coordEnd because otherwise it is not retrieved
      }
      await clearCoordAction();
      return commandRes;
    }
  };

  const handleDoTap = async (tapLocal) => {
    const {POINTER_NAME, DURATION_1, DURATION_2, BUTTON, VALUE} = DEFAULT_TAP;
    const nowDate = new Date();
    const diff = (nowDate.getTime() - date.getTime()) * 1000;
    setDate(nowDate);
    const commandRes = await applyClientMethod({
      methodName: TAP,
      args: [
        {
          [POINTER_NAME]: [
            {type: POINTER_MOVE, duration: DURATION_1, x: tapLocal.x, y: tapLocal.y},
            {type: POINTER_DOWN, button: BUTTON},
            {type: PAUSE, duration: diff/*DURATION_2*/},
            {type: POINTER_UP, button: BUTTON},
            {foundBy: '', value: ''},
          ],
        },
      ],
    });
    return commandRes;
  };

  const handleDoSwipe = async (swipeEndLocal) => {
    const {POINTER_NAME, DURATION_1, DURATION_2, BUTTON, ORIGIN} = DEFAULT_SWIPE;
    const commandRes = await applyClientMethod({
      methodName: SWIPE,
      args: [
        {
        [POINTER_NAME]: [
          {type: POINTER_MOVE, duration: DURATION_1, x: coordStart.x, y: coordStart.y},
          {type: POINTER_DOWN, button: BUTTON},
          {
            type: POINTER_MOVE,
            duration: DURATION_2,
            origin: ORIGIN,
            x: swipeEndLocal.x,
            y: swipeEndLocal.y,
          },
          {type: POINTER_UP, button: BUTTON},
          {foundBy: '', value: ''},
        ],
        }
      ],
    });
    return commandRes;
  };

  const handleScreenshotCoordsUpdate = (e) => {
    if (screenshotInteractionMode !== SELECT) {
      const offsetX = e.nativeEvent.offsetX;
      const offsetY = e.nativeEvent.offsetY;
      const newX = offsetX * scaleRatio;
      const newY = offsetY * scaleRatio;
      setX(Math.round(newX));
      setY(Math.round(newY));
    }
  };

  const handleScreenshotLeave = async () => {
    setX(null);
    setY(null);
    await clearCoordAction();
  };

  // retrieve and format gesture for svg drawings
  const getGestureCoordinates = () => {
    const {showGesture} = props;
    const {FILLED, NEW_DASHED, WHOLE, DASHED} = GESTURE_ITEM_STYLES;
    const defaultTypes = {pointerDown: WHOLE, pointerUp: DASHED};

    if (!showGesture) {
      return null;
    }
    return showGesture.map((pointer) => {
      // 'type' is used to keep track of the last pointerup/pointerdown move
      let type = DASHED;
      const temp = [];
      for (const tick of pointer.ticks) {
        if (tick.type === PAUSE) {
          continue;
        }
        const len = temp.length;
        type = tick.type !== POINTER_MOVE ? defaultTypes[tick.type] : type;
        if (tick.type === POINTER_MOVE && tick.x !== undefined && tick.y !== undefined) {
          temp.push({id: tick.id, type, x: tick.x, y: tick.y, color: pointer.color});
        }
        if (len === 0) {
          if (tick.type === POINTER_DOWN) {
            temp.push({id: tick.id, type: FILLED, x: 0, y: 0, color: pointer.color});
          }
        } else {
          if (tick.type === POINTER_DOWN && temp[len - 1].type === DASHED) {
            temp[len - 1].type = FILLED;
          }
          if (tick.type === POINTER_UP && temp[len - 1].type === WHOLE) {
            temp[len - 1].type = NEW_DASHED;
          }
        }
      }
      return temp;
    });
  };

  // If we're tapping or swiping, show the 'crosshair' cursor style
  const screenshotStyle = {};
  if (screenshotInteractionMode === TAP_SWIPE || selectedTick) {
    screenshotStyle.cursor = 'crosshair';
  }

  const screenSrc = mjpegScreenshotUrl || `data:image/gif;base64,${screenshot}`;
  const screenImg = <img src={screenSrc} id="screenshot" />;
  const points = getGestureCoordinates();

  // Show the screenshot and highlighter rects.
  // Show loading indicator if a method call is in progress, unless using MJPEG mode.
  return (
    <Spin size="large" spinning={!!methodCallInProgress && !mjpegScreenshotUrl}>
      <div className={styles.innerScreenshotContainer}>
        <div
          ref={containerEl}
          style={screenshotStyle}
          onMouseDown={handleScreenshotDown}
          onMouseUp={handleScreenshotUp}
          onMouseMove={handleScreenshotCoordsUpdate}
          onMouseOver={handleScreenshotCoordsUpdate}
          onMouseLeave={handleScreenshotLeave}
          onClick={handleScreenshotClick}
          className={styles.screenshotBox}
        >
          {screenshotInteractionMode !== SELECT && (
            <div className={styles.coordinatesContainer}>
              <p>{t('xCoordinate', {x})}</p>
              <p>{t('yCoordinate', {y})}</p>
            </div>
          )}
          {screenImg}
          {screenshotInteractionMode === SELECT && containerEl.current && (
            <HighlighterRects {...props} containerEl={containerEl.current} />
          )}
          {screenshotInteractionMode === TAP_SWIPE && (
            <svg className={styles.swipeSvg}>
              {coordStart && (
                <circle cx={coordStart.x / scaleRatio} cy={coordStart.y / scaleRatio} />
              )}
              {coordStart && !coordEnd && (
                <line
                  x1={coordStart.x / scaleRatio}
                  y1={coordStart.y / scaleRatio}
                  x2={x / scaleRatio}
                  y2={y / scaleRatio}
                />
              )}
              {coordStart && coordEnd && (
                <line
                  x1={coordStart.x / scaleRatio}
                  y1={coordStart.y / scaleRatio}
                  x2={coordEnd.x / scaleRatio}
                  y2={coordEnd.y / scaleRatio}
                />
              )}
            </svg>
          )}
          {selectedInspectorTab === INSPECTOR_TABS.GESTURES && points && (
            <svg key="gestureSVG" className={styles.gestureSvg}>
              {points.map((pointer) =>
                pointer.map((tick, index) => (
                  <Fragment key={tick.id}>
                    {index > 0 && (
                      <line
                        className={styles[tick.type]}
                        key={`${tick.id}.line`}
                        x1={pointer[index - 1].x / scaleRatio}
                        y1={pointer[index - 1].y / scaleRatio}
                        x2={tick.x / scaleRatio}
                        y2={tick.y / scaleRatio}
                        style={{stroke: tick.color}}
                      />
                    )}
                    <circle
                      className={styles[`circle-${tick.type}`]}
                      key={`${tick.id}.circle`}
                      cx={tick.x / scaleRatio}
                      cy={tick.y / scaleRatio}
                      style={
                        tick.type === GESTURE_ITEM_STYLES.FILLED
                          ? {fill: tick.color}
                          : {stroke: tick.color}
                      }
                    />
                  </Fragment>
                )),
              )}
            </svg>
          )}
        </div>
      </div>
      {checkVisible && (
        <>
          <TextCheckDialog key={forceRenderKey} visible={checkVisible} text={checkText} onClose={handleCloseCheck} {...props} />
        </>
      )}
      {enterVisible && (
        <>
          <TextEnterDialog key={forceRenderKey} visible={enterVisible} text={enterText} onClose={handleCloseEnter} {...props} />
        </>
      )}
      {(existenceVisible &&
        <>
          <ConfirmExistanceDialog visible={existenceVisible} onClose={handleCloseExistence} {...props} />
        </>
      )}
    </Spin>
  );
};

export default Screenshot;
