/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./app/js/chatbot/AudioVisualizer.js":
/*!*******************************************!*\
  !*** ./app/js/chatbot/AudioVisualizer.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AudioVisualizerTwoStreams)
/* harmony export */ });
// Previous: 2.7.0
// Current: 2.7.7

const {
  useState,
  useRef,
  useEffect
} = wp.element;
function measureVolume(analyser, dataArray) {
  analyser.getByteTimeDomainData(dataArray);
  let sum = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const val = dataArray[i] - 128;
    sum += val * val;
  }
  return Math.sqrt(sum / dataArray.length);
}
function AudioVisualizerTwoStreams({
  assistantStream = null,
  userStream = null,
  assistantColor = null,
  userColor = null,
  userUI = {
    emoji: null,
    text: null,
    image: null,
    use: "text"
  },
  assistantUI = {
    emoji: null,
    text: null,
    image: null,
    use: "text"
  },
  attackSpeed = 0.3,
  releaseSpeed = 0.05,
  circleSize = 50,
  pulseMaxSize = 30
}) {
  const [assistantVolume, setAssistantVolume] = useState(0);
  const [userVolume, setUserVolume] = useState(0);
  const assistantSmoothedRef = useRef(0);
  const userSmoothedRef = useRef(0);
  const audioContextRef = useRef(null);
  const assistantAnalyserRef = useRef(null);
  const assistantDataArrayRef = useRef(null);
  const userAnalyserRef = useRef(null);
  const userDataArrayRef = useRef(null);
  useEffect(() => {
    if (!assistantStream && !userStream) {
      return;
    }
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    const audioContext = audioContextRef.current;
    let assistantSource = null;
    let userSource = null;
    let animationFrameId = null;
    if (assistantStream) {
      assistantSource = audioContext.createMediaStreamSource(assistantStream);
      assistantAnalyserRef.current = audioContext.createAnalyser();
      assistantAnalyserRef.current.fftSize = 1024;
      assistantDataArrayRef.current = new Uint8Array(assistantAnalyserRef.current.frequencyBinCount);
      assistantSource.connect(assistantAnalyserRef.current);
    }
    if (userStream) {
      userSource = audioContext.createMediaStreamSource(userStream);
      userAnalyserRef.current = audioContext.createAnalyser();
      userAnalyserRef.current.fftSize = 1024;
      userDataArrayRef.current = new Uint8Array(userAnalyserRef.current.frequencyBinCount);
      userSource.connect(userAnalyserRef.current);
    }
    const tick = () => {
      let newAssistantVolume = 0;
      if (assistantAnalyserRef.current && assistantDataArrayRef.current) {
        newAssistantVolume = measureVolume(assistantAnalyserRef.current, assistantDataArrayRef.current);
      }
      let newUserVolume = 0;
      if (userAnalyserRef.current && userDataArrayRef.current) {
        newUserVolume = measureVolume(userAnalyserRef.current, userDataArrayRef.current);
      }
      if (newAssistantVolume > assistantSmoothedRef.current) {
        assistantSmoothedRef.current = assistantSmoothedRef.current * (1 - attackSpeed) + newAssistantVolume * attackSpeed;
      } else {
        assistantSmoothedRef.current = assistantSmoothedRef.current * (1 - releaseSpeed) + newAssistantVolume * releaseSpeed;
      }
      if (newUserVolume > userSmoothedRef.current) {
        userSmoothedRef.current = userSmoothedRef.current * (1 - attackSpeed) + newUserVolume * attackSpeed;
      } else {
        userSmoothedRef.current = userSmoothedRef.current * (1 - releaseSpeed) + newUserVolume * releaseSpeed;
      }
      setAssistantVolume(assistantSmoothedRef.current);
      setUserVolume(userSmoothedRef.current);
      animationFrameId = requestAnimationFrame(tick);
    };
    tick();
    return () => {
      if (assistantSource) assistantSource.disconnect();
      if (assistantAnalyserRef.current) assistantAnalyserRef.current.disconnect();
      if (userSource) userSource.disconnect();
      if (userAnalyserRef.current) userAnalyserRef.current.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [assistantStream, userStream, attackSpeed, releaseSpeed]);
  const normAssistant = Math.min(assistantVolume / 20, 1);
  const normUser = Math.min(userVolume / 20, 1);
  const assistantPulseDiameter = circleSize + normAssistant * pulseMaxSize;
  const userPulseDiameter = circleSize + normUser * pulseMaxSize;
  const containerSize = circleSize + pulseMaxSize;
  const userPulseStyle = {
    width: userPulseDiameter,
    height: userPulseDiameter,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.5
  };
  if (userColor !== null) {
    userPulseStyle.backgroundColor = userColor;
  }
  const assistantPulseStyle = {
    width: assistantPulseDiameter,
    height: assistantPulseDiameter,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    opacity: 0.5
  };
  if (assistantColor !== null) {
    assistantPulseStyle.backgroundColor = assistantColor;
  }
  const userCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    color: "#fff"
  };
  if (userColor !== null) {
    userCircleStyle.backgroundColor = userColor;
  }
  const assistantCircleStyle = {
    width: circleSize,
    height: circleSize,
    borderRadius: "50%",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    color: "#fff"
  };
  if (assistantColor !== null) {
    assistantCircleStyle.backgroundColor = assistantColor;
  }
  let containerClass = "mwai-visualizer";
  if (userVolume > assistantVolume) {
    containerClass += " mwai-user-talking";
  } else if (assistantVolume > userVolume) {
    containerClass += " mwai-assistant-talking";
  }
  const renderUI = uiObj => {
    if (!uiObj) return null;
    const {
      emoji,
      text,
      image,
      use
    } = uiObj;
    switch (use) {
      case "emoji":
        if (emoji) return /*#__PURE__*/React.createElement("span", null, emoji);
        if (text) return /*#__PURE__*/React.createElement("span", null, text.slice(0, 1));
        return null;
      case "image":
        if (image) {
          return /*#__PURE__*/React.createElement("img", {
            src: image,
            alt: "",
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "50%"
            }
          });
        }
        if (emoji) return /*#__PURE__*/React.createElement("span", null, emoji);
        if (text) return /*#__PURE__*/React.createElement("span", null, text.slice(0, 1));
        return null;
      case "text":
      default:
        if (text) return /*#__PURE__*/React.createElement("span", null, text.slice(0, 1));
        if (emoji) return /*#__PURE__*/React.createElement("span", null, emoji);
        return null;
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    className: containerClass
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-visualizer-user",
    style: {
      position: "relative",
      width: containerSize,
      height: containerSize,
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-animation",
    style: userPulseStyle
  }), /*#__PURE__*/React.createElement("div", {
    style: userCircleStyle
  }, renderUI(userUI))), /*#__PURE__*/React.createElement("hr", {
    className: "mwai-visualizer-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "mwai-visualizer-assistant",
    style: {
      position: "relative",
      width: containerSize,
      height: containerSize,
      overflow: "visible"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-animation",
    style: assistantPulseStyle
  }), /*#__PURE__*/React.createElement("div", {
    style: assistantCircleStyle
  }, renderUI(assistantUI))));
}

/***/ }),

/***/ "./app/js/chatbot/ChatUploadIcon.js":
/*!******************************************!*\
  !*** ./app/js/chatbot/ChatUploadIcon.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./app/js/chatbot/helpers.js");
// Previous: 2.4.5
// Current: 2.6.8




// React & Vendor Libs
const {
  useState,
  useMemo,
  useRef
} = wp.element;
const ChatUploadIcon = () => {
  const css = (0,_helpers__WEBPACK_IMPORTED_MODULE_0__.useClasses)();
  const {
    state,
    actions
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_1__.useChatbotContext)();
  const {
    uploadedFile,
    busy,
    imageUpload,
    fileUpload,
    fileSearch,
    draggingType
  } = state;
  const {
    onUploadFile
  } = actions;
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef();
  const hasUploadedFile = uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.uploadedId;
  const uploadEnabled = imageUpload || fileSearch || fileUpload;
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  const resetUpload = () => onUploadFile(null);
  const handleClick = () => {
    if (uploadedFile !== null && uploadedFile !== void 0 && uploadedFile.localFile) {
      resetUpload();
      return;
    }
    if (!busy) {
      fileInputRef.current.click();
    }
  };
  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) onUploadFile(file);
  };
  const file = uploadedFile;
  const type = useMemo(() => {
    if (file !== null && file !== void 0 && file.localFile) {
      return file.localFile.type.startsWith('image/') ? 'image' : 'document';
    }
    return draggingType;
  }, [file, draggingType]);
  const imgClass = useMemo(() => {
    let status = 'idle';
    if (file !== null && file !== void 0 && file.uploadProgress) {
      status = 'up';
    } else if (draggingType) {
      status = 'add';
    } else if (isHovering && hasUploadedFile) {
      status = 'del';
    } else if (hasUploadedFile) {
      status = 'ok';
    } else if (isHovering && !hasUploadedFile) {
      status = 'add';
    }
    const typeClass = type ? type.toLowerCase() : 'idle';
    return `mwai-file-upload-icon mwai-${typeClass}-${status}`;
  }, [type, file, draggingType, isHovering, hasUploadedFile]);
  const uploadProgress = useMemo(() => {
    if (file !== null && file !== void 0 && file.uploadProgress) {
      if (file.uploadProgress > 99) {
        return 99;
      }
      return Math.round(file.uploadProgress);
    }
    return "";
  }, [file]);
  return uploadEnabled ? /*#__PURE__*/React.createElement("div", {
    disabled: busy,
    onClick: handleClick,
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    className: css('mwai-file-upload', {
      'mwai-enabled': uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.uploadedId,
      'mwai-busy': (uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.localFile) && !(uploadedFile !== null && uploadedFile !== void 0 && uploadedFile.uploadedId)
    }),
    style: {
      cursor: busy ? 'default' : 'pointer'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: imgClass
  }, /*#__PURE__*/React.createElement("span", {
    className: "mwai-file-upload-progress"
  }, uploadProgress)), /*#__PURE__*/React.createElement("input", {
    type: "file",
    ref: fileInputRef,
    onChange: handleFileChange,
    style: {
      display: 'none'
    }
  })) : null;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatUploadIcon);

/***/ }),

/***/ "./app/js/chatbot/ChatbotContext.js":
/*!******************************************!*\
  !*** ./app/js/chatbot/ChatbotContext.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChatbotContextProvider: () => (/* binding */ ChatbotContextProvider),
/* harmony export */   useChatbotContext: () => (/* binding */ useChatbotContext)
/* harmony export */ });
/* harmony import */ var _app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @app/chatbot/MwaiAPI */ "./app/js/chatbot/MwaiAPI.js");
/* harmony import */ var _app_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/helpers */ "./app/js/helpers.js");
// Previous: 2.7.3
// Current: 2.7.7

const {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef
} = wp.element;




const rawAiName = 'AI: ';
const rawUserName = 'User: ';
const ChatbotContext = createContext();
const useChatbotContext = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbotContext must be used within a ChatbotContextProvider');
  }
  return context;
};
const ChatbotContextProvider = ({
  children,
  ...rest
}) => {
  var _params$startSentence;
  const {
    params,
    system,
    theme,
    atts
  } = rest;
  const {
    timeElapsed,
    startChrono,
    stopChrono
  } = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useChrono)();
  const shortcodeStyles = useMemo(() => (theme === null || theme === void 0 ? void 0 : theme.settings) || {}, [theme]);
  const [restNonce, setRestNonce] = useState(system.restNonce);
  const [messages, setMessages] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [locked, setLocked] = useState(false);
  const [chatId, setChatId] = useState((0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)());
  const [inputText, setInputText] = useState('');
  const [chatbotTriggered, setChatbotTriggered] = useState(false);
  const [showIconMessage, setShowIconMessage] = useState(false);
  const [uploadedFile, setUploadedFile] = useState({
    localFile: null,
    uploadedId: null,
    uploadedUrl: null,
    uploadProgress: null
  });
  const [windowed, setWindowed] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [busyNonce, setBusyNonce] = useState(false);
  const [serverReply, setServerReply] = useState();
  const chatbotInputRef = useRef();
  const conversationRef = useRef();
  const hasFocusRef = useRef(false);
  const {
    isListening,
    setIsListening,
    speechRecognitionAvailable
  } = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useSpeechRecognition)(text => {
    setInputText(text);
  });
  const stream = system.stream ?? false; // Changed ?? to ?? for consistency
  const internalId = useMemo(() => (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)(), []);
  const botId = system.botId;
  const customId = system.customId;
  const userData = system.userData;
  const sessionId = system.sessionId;
  const contextId = system.contextId;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode;
  const virtualKeyboardFix = system.virtual_keyboard_fix;
  const typewriter = (system === null || system === void 0 ? void 0 : system.typewriter) ?? false;
  const speechRecognition = (system === null || system === void 0 ? void 0 : system.speech_recognition) ?? false;
  const speechSynthesis = (system === null || system === void 0 ? void 0 : system.speech_synthesis) ?? false;
  const startSentence = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.doPlaceholders)(((_params$startSentence = params.startSentence) === null || _params$startSentence === void 0 ? void 0 : _params$startSentence.trim()) ?? "", userData);
  const initialActions = system.actions ?? [];
  const initialShortcuts = system.shortcuts ?? [];
  const initialBlocks = system.blocks ?? [];
  const isMobile = document.innerWidth <= 768;
  const processedParams = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.processParameters)(params, userData);
  const {
    aiName,
    userName,
    guestName,
    aiAvatar,
    userAvatar,
    guestAvatar
  } = processedParams;
  const {
    textSend,
    textClear,
    textInputMaxLength,
    textInputPlaceholder,
    textCompliance,
    window: isWindow,
    copyButton,
    headerSubtitle,
    fullscreen,
    localMemory: localMemoryParam,
    icon,
    iconText,
    iconTextDelay,
    iconAlt,
    iconPosition,
    iconBubble,
    imageUpload,
    fileUpload,
    fileSearch
  } = processedParams;
  const isRealtime = processedParams.mode === 'realtime';
  const localMemory = localMemoryParam && (!!customId || !!botId);
  const localStorageKey = localMemory ? `mwai-chat-${customId || botId}` : null;
  const {
    cssVariables,
    iconUrl,
    aiAvatarUrl,
    userAvatarUrl,
    guestAvatarUrl
  } = useMemo(() => {
    const processUrl = url => {
      if (!url) return null;
      if ((0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.isEmoji)(url)) return url;
      return (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.isURL)(url) ? url : `${pluginUrl}/images/${url}`;
    };
    const iconUrl = icon ? processUrl(icon) : `${pluginUrl}/images/chat-traditional-1.svg`;
    const finalAiAvatarUrl = processUrl(processedParams.aiAvatarUrl);
    const finalUserAvatarUrl = processUrl(processedParams.userAvatarUrl);
    const finalGuestAvatarUrl = processUrl(processedParams.guestAvatarUrl);
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return {
      cssVariables,
      iconUrl,
      aiAvatarUrl: finalAiAvatarUrl,
      userAvatarUrl: finalUserAvatarUrl,
      guestAvatarUrl: finalGuestAvatarUrl
    };
  }, [icon, pluginUrl, shortcodeStyles, processedParams]);
  const [draggingType, setDraggingType] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const uploadIconPosition = useMemo(() => {
    if ((theme === null || theme === void 0 ? void 0 : theme.themeId) === 'timeless') {
      return 'mwai-tools';
    }
    return "mwai-input";
  }, [theme === null || theme === void 0 ? void 0 : theme.themeId]);
  const submitButtonConf = useMemo(() => {
    return {
      text: textSend,
      textSend: textSend,
      textClear: textClear,
      imageSend: (theme === null || theme === void 0 ? void 0 : theme.themeId) === 'timeless' ? pluginUrl + '/images/action-submit-blue.svg' : null,
      imageClear: (theme === null || theme === void 0 ? void 0 : theme.themeId) === 'timeless' ? pluginUrl + '/images/action-clear-blue.svg' : null
    };
  }, [pluginUrl, textClear, textSend, theme === null || theme === void 0 ? void 0 : theme.themeId]);
  const resetMessages = () => {
    resetUploadedFile();
    if (startSentence) {
      const freshMessages = [{
        id: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)(),
        role: 'assistant',
        content: startSentence,
        who: rawAiName,
        timestamp: new Date().getTime()
      }];
      setMessages(freshMessages);
    } else {
      setMessages([]);
    }
  };
  const refreshRestNonce = useCallback(async (force = false) => {
    try {
      if (!force && restNonce) {
        return restNonce;
      }
      setBusyNonce(true);
      const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetch)(`${restUrl}/mwai/v1/start_session`);
      const data = await res.json();
      setRestNonce(data.restNonce);
      return data.restNonce;
    } catch (err) {
      console.error('Error while fetching the restNonce.', err);
    } finally {
      setBusyNonce(false);
    }
  }, [restNonce, setRestNonce, restUrl]);
  useEffect(() => {
    if (initialActions.length > 0) {
      handleActions(initialActions);
    }
    if (initialShortcuts.length > 0) {
      handleShortcuts(initialShortcuts);
    }
    if (initialBlocks.length > 0) {
      handleBlocks(initialBlocks);
    }
  }, []);
  useEffect(() => {
    if (chatbotTriggered && !restNonce) {
      refreshRestNonce();
    }
  }, [chatbotTriggered, restNonce]); // added restNonce dependency

  useEffect(() => {
    if (inputText.length > 0 && !chatbotTriggered) {
      setChatbotTriggered(true);
    }
  }, [chatbotTriggered, inputText]);
  useEffect(() => {
    resetMessages();
  }, [startSentence]);
  useEffect(() => {
    if (customId || botId) {
      const existingChatbotIndex = _app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__.mwaiAPI.chatbots.findIndex(chatbot => chatbot.internalId === internalId);
      const chatbot = {
        internalId: internalId,
        botId: botId,
        chatId: chatId,
        customId: customId,
        open: () => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'open'
          }]);
        },
        close: () => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'close'
          }]);
        },
        clear: params => {
          const {
            chatId = null
          } = params || {};
          setTasks(prevTasks => [...prevTasks, {
            action: 'clear',
            data: {
              chatId
            }
          }]);
        },
        toggle: () => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'toggle'
          }]);
        },
        ask: (text, submit = false) => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'ask',
            data: {
              text,
              submit
            }
          }]);
        },
        lock: () => {
          setLocked(true);
        },
        unlock: () => {
          setLocked(false);
        },
        setShortcuts: shortcuts => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'setShortcuts',
            data: shortcuts
          }]);
        },
        setBlocks: blocks => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'setBlocks',
            data: blocks
          }]);
        },
        addBlock: block => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'addBlock',
            data: block
          }]);
        },
        removeBlockById: blockId => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'removeBlockById',
            data: blockId
          }]);
        },
        getBlocks: () => {
          return blocks;
        },
        setContext: ({
          chatId,
          messages
        }) => {
          setTasks(prevTasks => [...prevTasks, {
            action: 'setContext',
            data: {
              chatId,
              messages
            }
          }]);
        }
      };
      if (existingChatbotIndex !== -1) {
        _app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__.mwaiAPI.chatbots[existingChatbotIndex] = chatbot;
      } else {
        _app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__.mwaiAPI.chatbots.push(chatbot);
      }
    }
  }, [botId, chatId, customId, internalId, blocks, messages]);
  useEffect(() => {
    if (busy) {
      startChrono();
      return;
    }
    if (!isMobile && hasFocusRef.current) {
      // Potential bug: focusInput might be undefined if ref's current element is not properly set.
      chatbotInputRef.current.focusInput && chatbotInputRef.current.focusInput();
    }
    stopChrono();
  }, [busy, isMobile, startChrono, stopChrono]);
  const saveMessages = useCallback(messages => {
    if (!localStorageKey) {
      return;
    }
    localStorage.setItem(localStorageKey, (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.nekoStringify)({
      chatId: chatId,
      messages: messages
    }));
  }, [localStorageKey, chatId]);
  const resetError = () => {
    setError(null);
  };
  useEffect(() => {
    let chatHistory = [];
    if (localStorageKey) {
      chatHistory = localStorage.getItem(localStorageKey);
      if (chatHistory) {
        try {
          chatHistory = JSON.parse(chatHistory);
          setMessages(chatHistory.messages);
          setChatId(chatHistory.chatId);
        } catch (e) {
          // faulty parsing could cause silent failure but keep fallback
        }
        return;
      }
    }
    resetMessages();
  }, [botId]); // Potential bug: depends only on botId, but should depend on localStorageKey?

  const handleActions = useCallback((actions, lastMessage) => {
    actions = actions || [];
    let callsCount = 0;
    for (const action of actions) {
      if (action.type === 'function') {
        const data = action.data || {};
        const {
          name = null,
          args = []
        } = data;
        const finalArgs = args ? Object.values(args).map(arg => {
          return JSON.stringify(arg);
        }) : [];
        try {
          if (debugMode) {
            console.log(`[CHATBOT] CALL ${name}(${finalArgs.join(', ')})`);
          }
          // Potential bug: eval with string interpolation may evaluate unintended code if name is malicious.
          eval(`${name}(${finalArgs.join(', ')})`);
          callsCount++;
        } catch (err) {
          console.error('Error while executing an action.', err);
        }
      }
    }
    if (!lastMessage.content && callsCount > 0) {
      lastMessage.content = `*Done!*`;
    }
  }, [debugMode]);
  const handleShortcuts = useCallback(shortcuts => {
    setShortcuts(shortcuts || []);
  }, []);
  const handleBlocks = useCallback(blocks => {
    setBlocks(blocks || []);
  }, []);
  useEffect(() => {
    if (!serverReply) return;
    setBusy(false);
    const freshMessages = [...messages];
    const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
    if (!serverReply.success) {
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
        freshMessages.pop();
      }
      if (lastMessage && lastMessage.role === 'user') {
        freshMessages.pop();
      }
      freshMessages.push({
        id: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)(),
        role: 'system',
        content: serverReply.message,
        who: rawAiName,
        timestamp: new Date().getTime()
      });
      setMessages(freshMessages);
      saveMessages(freshMessages);
      return;
    }
    if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isQuerying) {
      lastMessage.content = (0,_app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__.applyFilters)('ai.reply', serverReply.reply, {
        chatId,
        botId
      });
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isQuerying;
      handleActions(serverReply === null || serverReply === void 0 ? void 0 : serverReply.actions, lastMessage);
      handleBlocks(serverReply === null || serverReply === void 0 ? void 0 : serverReply.blocks);
      handleShortcuts(serverReply === null || serverReply === void 0 ? void 0 : serverReply.shortcuts);
    } else if (lastMessage && lastMessage.role === 'assistant' && lastMessage.isStreaming) {
      lastMessage.content = (0,_app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__.applyFilters)('ai.reply', serverReply.reply, {
        chatId,
        botId
      });
      if (serverReply.images) {
        lastMessage.images = serverReply.images;
      }
      lastMessage.timestamp = new Date().getTime();
      delete lastMessage.isStreaming;
      handleActions(serverReply === null || serverReply === void 0 ? void 0 : serverReply.actions, lastMessage);
      handleBlocks(serverReply === null || serverReply === void 0 ? void 0 : serverReply.blocks);
      handleShortcuts(serverReply === null || serverReply === void 0 ? void 0 : serverReply.shortcuts);
    } else {
      const newMessage = {
        id: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)(),
        role: 'assistant',
        content: (0,_app_chatbot_MwaiAPI__WEBPACK_IMPORTED_MODULE_2__.applyFilters)('ai.reply', serverReply.reply, {
          botId,
          chatId,
          customId
        }),
        who: rawAiName,
        timestamp: new Date().getTime()
      };
      if (serverReply.images) {
        newMessage.images = serverReply.images;
      }
      handleActions(serverReply === null || serverReply === void 0 ? void 0 : serverReply.actions, newMessage);
      handleBlocks(serverReply === null || serverReply === void 0 ? void 0 : serverReply.blocks);
      handleShortcuts(serverReply === null || serverReply === void 0 ? void 0 : serverReply.shortcuts);
      // Potential bug: still push even if serverReply.reply is undefined (possible if reply is null)
      // but assume acceptable.
      freshMessages.push(newMessage);
    }
    setMessages(freshMessages);
    saveMessages(freshMessages);
  }, [serverReply, messages, handleActions, handleBlocks, handleShortcuts, saveMessages, chatId, botId, customId]);
  const onClear = useCallback(async ({
    chatId = null
  } = {}) => {
    if (!chatId) {
      chatId = (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)();
    }
    await setChatId(chatId);
    if (localStorageKey) {
      localStorage.removeItem(localStorageKey);
    }
    resetMessages();
    setInputText('');
    setShortcuts([]);
    setBlocks([]);
  }, [localStorageKey, resetMessages]);
  const onStartRealtimeSession = useCallback(async () => {
    const body = {
      botId: botId,
      customId: customId,
      contextId: contextId,
      chatId: chatId
    };
    const nonce = restNonce ?? (await refreshRestNonce());
    const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetch)(`${restUrl}/mwai-ui/v1/openai/realtime/start`, body, nonce);
    const data = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiHandleRes)(res);
    return data;
  }, [botId, customId, contextId, chatId, restNonce, refreshRestNonce, restUrl]);
  const onCommitStats = useCallback(async (stats, refId = null) => {
    try {
      const nonce = restNonce ?? (await refreshRestNonce());
      const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetch)(`${restUrl}/mwai-ui/v1/openai/realtime/stats`, {
        botId: botId,
        session: sessionId,
        refId: refId || chatId,
        stats: stats
      }, nonce);
      const data = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiHandleRes)(res);
      return {
        success: data.success,
        message: data.message
      };
    } catch (err) {
      console.error('Error while committing stats.', err);
      return {
        success: false,
        message: 'An error occurred while committing the stats.'
      };
    }
  }, [botId, restNonce, refreshRestNonce, restUrl, sessionId, chatId]);
  const onCommitDiscussions = useCallback(async (messages = []) => {
    try {
      const nonce = restNonce ?? (await refreshRestNonce());
      const payload = {
        botId: botId,
        session: sessionId,
        chatId: chatId,
        messages: messages ?? []
      };
      const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetch)(`${restUrl}/mwai-ui/v1/openai/realtime/discussions`, payload, nonce);
      const data = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiHandleRes)(res);
      return {
        success: data.success,
        message: data.message
      };
    } catch (err) {
      console.error('Error while committing discussion.', err);
      return {
        success: false,
        message: 'An error occurred while committing the discussion.'
      };
    }
  }, [botId, chatId, restNonce, refreshRestNonce, restUrl, sessionId]);
  const onRealtimeFunctionCallback = useCallback(async (functionId, functionType, functionName, functionTarget, args) => {
    const body = {
      functionId,
      functionType,
      functionName,
      functionTarget,
      arguments: args
    };
    if (functionTarget === 'js') {
      const finalArgs = args ? Object.values(args).map(arg => {
        return JSON.stringify(arg);
      }) : [];
      try {
        if (debugMode) {
          console.log(`[CHATBOT] CALL ${functionName}(${finalArgs.join(', ')})`);
        }
        eval(`${functionName}(${finalArgs.join(', ')})`);
        return {
          success: true,
          message: 'The function was executed',
          data: null
        };
      } catch (err) {
        console.error('Error while executing an action.', err);
        return {
          success: false,
          message: 'An error occurred while executing the function.',
          data: null
        };
      }
    } else {
      const nonce = restNonce ?? (await refreshRestNonce());
      const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetch)(`${restUrl}/mwai-ui/v1/openai/realtime/call`, body, nonce);
      const data = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiHandleRes)(res);
      return data;
    }
  }, [restNonce, refreshRestNonce, restUrl, debugMode]);
  const onSubmit = useCallback(async textQuery => {
    var _uploadedFile$localFi;
    if (busy) {
      console.error('AI Engine: There is already a query in progress.');
      return;
    }
    if (typeof textQuery !== 'string') {
      textQuery = inputText;
    }
    const currentFile = uploadedFile;
    const currentImageUrl = uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.uploadedUrl;
    const mimeType = uploadedFile === null || uploadedFile === void 0 || (_uploadedFile$localFi = uploadedFile.localFile) === null || _uploadedFile$localFi === void 0 ? void 0 : _uploadedFile$localFi.type;
    const isImage = mimeType ? mimeType.startsWith('image') : false;
    let textDisplay = textQuery;
    if (currentImageUrl) {
      if (isImage) {
        textDisplay = `![Uploaded Image](${currentImageUrl})\n${textQuery}`;
      } else {
        textDisplay = `[Uploaded File](${currentImageUrl})\n${textQuery}`;
      }
    }
    setBusy(true);
    setInputText('');
    setShortcuts([]);
    setBlocks([]);
    resetUploadedFile();
    const bodyMessages = [...messages, {
      id: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)(),
      role: 'user',
      content: textDisplay,
      who: rawUserName,
      timestamp: new Date().getTime()
    }];
    saveMessages(bodyMessages);
    const freshMessageId = (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.randomStr)();
    const freshMessages = [...bodyMessages, {
      id: freshMessageId,
      role: 'assistant',
      content: null,
      who: rawAiName,
      timestamp: null,
      isQuerying: stream ? false : true,
      isStreaming: stream ? true : false
    }];
    setMessages(freshMessages);
    const body = {
      botId: botId,
      customId: customId,
      session: sessionId,
      chatId: chatId,
      contextId: contextId,
      messages: messages,
      newMessage: textQuery,
      newFileId: currentFile === null || currentFile === void 0 ? void 0 : currentFile.uploadedId,
      stream,
      ...atts
    };
    try {
      if (debugMode) {
        console.log('[CHATBOT] OUT: ', body);
      }
      const streamCallback = !stream ? null : content => {
        // bug: using messages closure but not updating references properly
        setMessages(messages => {
          const freshMessages = [...messages];
          const lastMessage = freshMessages.length > 0 ? freshMessages[freshMessages.length - 1] : null;
          if (lastMessage && lastMessage.id === freshMessageId) {
            lastMessage.content = content;
            lastMessage.timestamp = new Date().getTime();
          }
          return freshMessages;
        });
      };
      const nonce = restNonce ?? (await refreshRestNonce());
      const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetch)(`${restUrl}/mwai-ui/v1/chats/submit`, body, nonce, stream);
      const data = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiHandleRes)(res, streamCallback, debugMode ? "CHATBOT" : null);
      if (!data.success && data.message) {
        setError(data.message);
        const updatedMessages = [...freshMessages];
        updatedMessages.pop();
        updatedMessages.pop();
        setMessages(updatedMessages);
        saveMessages(updatedMessages);
        setBusy(false);
        return;
      }
      setServerReply(data);
    } catch (err) {
      console.error("An error happened in the handling of the chatbot response.", {
        err
      });
      setBusy(false);
    }
  }, [busy, uploadedFile, messages, saveMessages, stream, botId, customId, sessionId, chatId, contextId, atts, inputText, debugMode, restNonce, refreshRestNonce, restUrl, startSentence, handleActions, handleBlocks, handleShortcuts]);
  const onSubmitAction = useCallback((forcedText = null) => {
    var _chatbotInputRef$curr;
    const hasFileUploaded = !!(uploadedFile !== null && uploadedFile !== void 0 && uploadedFile.uploadedId);
    hasFocusRef.current = document.activeElement === ((_chatbotInputRef$curr = chatbotInputRef.current) === null || _chatbotInputRef$curr === void 0 ? void 0 : _chatbotInputRef$curr.currentElement());
    if (forcedText) {
      onSubmit(forcedText);
    } else if (hasFileUploaded || inputText.length > 0) {
      onSubmit(inputText);
    }
  }, [inputText, onSubmit, uploadedFile === null || uploadedFile === void 0 ? void 0 : uploadedFile.uploadedId]);
  const onFileUpload = async (file, type = "N/A", purpose = "N/A") => {
    try {
      if (file === null) {
        resetUploadedFile();
        return;
      }
      const params = {
        type,
        purpose
      };
      const url = `${restUrl}/mwai-ui/v1/files/upload`;
      const nonce = restNonce ?? (await refreshRestNonce());
      const res = await (0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.mwaiFetchUpload)(url, file, nonce, progress => {
        // bug: setUploadedFile might race with other uploads, no cancellation handling
        setUploadedFile({
          localFile: file,
          uploadedId: null,
          uploadedUrl: null,
          uploadProgress: progress
        });
      }, params);
      setUploadedFile({
        localFile: file,
        uploadedId: res.data.id,
        uploadedUrl: res.data.url,
        uploadProgress: null
      });
    } catch (error) {
      console.error('onFileUpload Error', error);
      setError(error.message || 'An unknown error occurred');
      resetUploadedFile();
    }
  };
  const onUploadFile = async file => {
    if (error) {
      resetError();
    }
    return onFileUpload(file);
  };
  const resetUploadedFile = () => {
    setUploadedFile({
      localFile: null,
      uploadedId: null,
      uploadedUrl: null,
      uploadProgress: null
    });
  };
  const runTimer = useCallback(() => {
    const timer = setTimeout(() => {
      setOpen(prevOpen => {
        if (!prevOpen) {
          setShowIconMessage(true);
        }
        return prevOpen; // bug: returns previous open, should be !prevOpen
      });
    }, iconTextDelay * 1000);
    return () => clearTimeout(timer);
  }, [iconText, iconTextDelay]);
  useEffect(() => {
    if (iconText && !iconTextDelay) {
      setShowIconMessage(true);
    } else if (iconText && iconTextDelay) {
      return runTimer();
    }
  }, [iconText, iconTextDelay]);
  const [tasks, setTasks] = useState([]);
  const runTasks = useCallback(async () => {
    if (tasks.length > 0) {
      const task = tasks[0];
      if (task.action === 'ask') {
        const {
          text,
          submit
        } = task.data;
        if (submit) {
          onSubmit(text);
        } else {
          setInputText(text);
        }
      } else if (task.action === 'toggle') {
        setOpen(prevOpen => !prevOpen);
      } else if (task.action === 'open') {
        setOpen(true);
      } else if (task.action === 'close') {
        setOpen(false);
      } else if (task.action === 'clear') {
        const {
          chatId
        } = task.data;
        onClear({
          chatId
        });
      } else if (task.action === 'setContext') {
        const {
          chatId,
          messages
        } = task.data;
        setChatId(chatId);
        setMessages(messages);
      } else if (task.action === 'setShortcuts') {
        const shortcuts = task.data;
        handleShortcuts(shortcuts);
      } else if (task.action === 'setBlocks') {
        const blocks = task.data;
        handleBlocks(blocks);
      } else if (task.action === 'addBlock') {
        const block = task.data;
        setBlocks(prevBlocks => {
          return [...prevBlocks, block];
        });
      } else if (task.action === 'removeBlockById') {
        const blockId = task.data;
        setBlocks(prevBlocks => {
          return prevBlocks.filter(block => block.id !== blockId);
        });
      }
      setTasks(prevTasks => prevTasks.slice(1));
    }
  }, [tasks, onClear, onSubmit, handleShortcuts, handleBlocks]);
  useEffect(() => {
    runTasks();
  }, [runTasks]);
  const actions = {
    setInputText,
    saveMessages,
    setMessages,
    resetMessages,
    resetError,
    onClear,
    onSubmit,
    onSubmitAction,
    onFileUpload,
    onUploadFile,
    setOpen,
    setWindowed,
    setShowIconMessage,
    setIsListening,
    setDraggingType,
    setIsBlocked,
    onStartRealtimeSession,
    onRealtimeFunctionCallback,
    onCommitStats,
    onCommitDiscussions
  };
  const state = {
    theme,
    botId,
    customId,
    userData,
    pluginUrl,
    inputText,
    messages,
    shortcuts,
    blocks,
    busy,
    error,
    setBusy,
    typewriter,
    speechRecognition,
    speechSynthesis,
    virtualKeyboardFix,
    localMemory,
    isRealtime,
    imageUpload,
    fileUpload,
    uploadedFile,
    fileSearch,
    textSend,
    textClear,
    textInputMaxLength,
    textInputPlaceholder,
    textCompliance,
    aiName,
    userName,
    guestName,
    aiAvatar,
    userAvatar,
    guestAvatar,
    aiAvatarUrl,
    userAvatarUrl,
    guestAvatarUrl,
    isWindow,
    copyButton,
    headerSubtitle,
    fullscreen,
    icon,
    iconText,
    iconAlt,
    iconPosition,
    iconBubble,
    cssVariables,
    iconUrl,
    chatbotInputRef,
    conversationRef,
    isMobile,
    open,
    locked,
    windowed,
    showIconMessage,
    timeElapsed,
    isListening,
    speechRecognitionAvailable,
    uploadIconPosition,
    submitButtonConf,
    draggingType,
    isBlocked,
    busyNonce
  };
  return /*#__PURE__*/React.createElement(ChatbotContext.Provider, {
    value: {
      state,
      actions
    }
  }, children);
};

/***/ }),

/***/ "./app/js/chatbot/ChatbotHeader.js":
/*!*****************************************!*\
  !*** ./app/js/chatbot/ChatbotHeader.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/helpers */ "./app/js/helpers.js");
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./app/js/chatbot/helpers.js");
// Previous: 2.4.7
// Current: 2.6.9

// React & Vendor Libs
const {
  useMemo
} = wp.element;



function formatAvatar(aiName, pluginUrl, iconUrl, aiAvatarUrl) {
  const getAvatarSrc = url => {
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isURL)(url)) {
      return url;
    } else if (url) {
      return `${pluginUrl}/images/${url}`;
    }
    return null;
  };
  const renderAvatar = (src, alt) => /*#__PURE__*/React.createElement("div", {
    className: "mwai-avatar"
  }, /*#__PURE__*/React.createElement("img", {
    alt: alt,
    src: src
  }));
  const renderEmoji = emoji => /*#__PURE__*/React.createElement("div", {
    className: "mwai-avatar mwai-emoji",
    style: {
      fontSize: '48px',
      lineHeight: '48px'
    }
  }, emoji);
  if ((0,_app_helpers__WEBPACK_IMPORTED_MODULE_1__.isEmoji)(aiAvatarUrl || iconUrl)) {
    return renderEmoji(aiAvatarUrl || iconUrl);
  }

  // Priority: aiAvatarUrl > iconUrl > default image
  const avatarSrc = getAvatarSrc(aiAvatarUrl) || iconUrl || `${pluginUrl}/images/chat-openai.svg`;
  if (avatarSrc) {
    return renderAvatar(avatarSrc, "AI Engine");
  }

  // If no avatar is available, return the aiName as text
  return /*#__PURE__*/React.createElement("div", {
    className: "mwai-name-text"
  }, aiName);
}
const ChatbotHeader = () => {
  const {
    state,
    actions
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_2__.useChatbotContext)();
  const {
    theme,
    isWindow,
    fullscreen,
    aiName,
    pluginUrl,
    open,
    iconUrl,
    aiAvatarUrl,
    windowed,
    headerSubtitle
  } = state;
  const {
    setOpen,
    setWindowed
  } = actions;
  const headerContent = useMemo(() => {
    if (!isWindow) {
      return null;
    }
    const timelessStyle = (theme === null || theme === void 0 ? void 0 : theme.themeId) === 'timeless';
    const avatarImage = timelessStyle ? formatAvatar(aiName, pluginUrl, iconUrl, aiAvatarUrl) : null;
    const finalHeaderSubtitle = headerSubtitle === null || headerSubtitle === undefined ? "Discuss with" : headerSubtitle;
    return /*#__PURE__*/React.createElement(React.Fragment, null, timelessStyle && /*#__PURE__*/React.createElement(React.Fragment, null, avatarImage, /*#__PURE__*/React.createElement("div", {
      className: "mwai-name"
    }, finalHeaderSubtitle && /*#__PURE__*/React.createElement("small", {
      className: "mwai-subtitle"
    }, finalHeaderSubtitle), /*#__PURE__*/React.createElement("div", null, aiName)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 'auto'
      }
    })), /*#__PURE__*/React.createElement("div", {
      className: "mwai-buttons"
    }, fullscreen && /*#__PURE__*/React.createElement("div", {
      className: "mwai-resize-button",
      onClick: () => setWindowed(!windowed)
    }), /*#__PURE__*/React.createElement("div", {
      className: "mwai-close-button",
      onClick: () => setOpen(!open)
    })));
  }, [isWindow, theme === null || theme === void 0 ? void 0 : theme.themeId, aiName, pluginUrl, iconUrl, aiAvatarUrl, fullscreen, setWindowed, windowed, setOpen, open, headerSubtitle]);
  return /*#__PURE__*/React.createElement("div", {
    className: "mwai-header"
  }, headerContent);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotHeader);

/***/ }),

/***/ "./app/js/chatbot/ChatbotInput.js":
/*!****************************************!*\
  !*** ./app/js/chatbot/ChatbotInput.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react_textarea_autosize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react-textarea-autosize */ "./node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js");
/* harmony import */ var _app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _ChatUploadIcon__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChatUploadIcon */ "./app/js/chatbot/ChatUploadIcon.js");
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
// Previous: 2.5.0
// Current: 2.7.7

// React & Vendor Libs
const {
  useRef,
  useState,
  useEffect,
  useImperativeHandle
} = wp.element;




const ChatbotInput = () => {
  const css = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useClasses)();
  const {
    state,
    actions
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_1__.useChatbotContext)();
  const {
    inputText,
    textInputMaxLength,
    textInputPlaceholder,
    error,
    speechRecognitionAvailable,
    isMobile,
    conversationRef,
    open,
    uploadIconPosition,
    locked,
    isListening,
    busy,
    speechRecognition,
    chatbotInputRef
  } = state;
  const {
    onSubmitAction,
    setIsListening,
    resetError,
    setInputText
  } = actions;
  const [composing, setComposing] = useState(false);
  const inputRef = useRef();
  useImperativeHandle(chatbotInputRef, () => ({
    focusInput: () => {
      var _inputRef$current;
      (_inputRef$current = inputRef.current) === null || _inputRef$current === void 0 || _inputRef$current.focus();
    },
    currentElement: () => inputRef.current
  }));

  // Focus input when opening (except mobile)
  useEffect(() => {
    if (!isMobile && open) {
      inputRef.current.focus();
    }
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [open, isMobile, conversationRef]);
  const onTypeText = text => {
    if (isListening) {
      setIsListening(false);
    }
    if (error) {
      resetError();
    }
    setInputText(text);
  };
  const classNames = css('mwai-input-text', {});
  return /*#__PURE__*/React.createElement("div", {
    ref: chatbotInputRef,
    className: classNames
  }, uploadIconPosition === 'mwai-input' && /*#__PURE__*/React.createElement(_ChatUploadIcon__WEBPACK_IMPORTED_MODULE_2__["default"], null), /*#__PURE__*/React.createElement(react_textarea_autosize__WEBPACK_IMPORTED_MODULE_3__["default"], {
    ref: inputRef,
    disabled: busy || locked,
    placeholder: textInputPlaceholder,
    value: inputText,
    maxLength: textInputMaxLength,
    onCompositionStart: () => setComposing(true),
    onCompositionEnd: () => setComposing(false),
    onKeyDown: event => {
      if (composing) return;
      if (event.code === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        onSubmitAction();
      }
    },
    onChange: e => onTypeText(e.target.value)
  }), speechRecognition && /*#__PURE__*/React.createElement(_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.Microphone, {
    active: isListening,
    disabled: !speechRecognitionAvailable || busy,
    className: "mwai-microphone",
    onClick: () => setIsListening(!isListening)
  }));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotInput);

/***/ }),

/***/ "./app/js/chatbot/ChatbotName.js":
/*!***************************************!*\
  !*** ./app/js/chatbot/ChatbotName.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
// Previous: 2.4.6
// Current: 2.4.7

// React & Vendor Libs
const {
  useMemo
} = wp.element;



const ChatbotName = ({
  role = 'user'
}) => {
  const {
    state
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__.useChatbotContext)();
  const {
    pluginUrl,
    iconUrl,
    userData,
    userName,
    aiName,
    guestName,
    userAvatar,
    aiAvatar,
    guestAvatar,
    userAvatarUrl,
    aiAvatarUrl,
    guestAvatarUrl
  } = state;
  const formattedOutput = useMemo(() => {
    const isAi = role === 'assistant';
    const isGuest = !userData && !isAi;
    const getAvatarSrc = (url, isUserData = false) => {
      if ((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isURL)(url)) {
        return url;
      } else if (url && !(0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isEmoji)(url)) {
        return isUserData ? url : `${pluginUrl}/images/${url}`;
      }
      if (!isUserData && !(0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isEmoji)(url)) {
        console.warn('Invalid URL for avatar:', url);
      }
      return null;
    };
    const renderAvatar = (src, alt) => /*#__PURE__*/React.createElement("div", {
      className: "mwai-avatar"
    }, /*#__PURE__*/React.createElement("img", {
      width: "32",
      height: "32",
      src: src,
      alt: alt
    }));
    const renderEmoji = emoji => /*#__PURE__*/React.createElement("div", {
      className: "mwai-avatar mwai-emoji",
      style: {
        fontSize: '32px',
        lineHeight: '32px'
      }
    }, emoji);
    const renderName = name => /*#__PURE__*/React.createElement("div", {
      className: "mwai-name-text"
    }, name);
    const getAvatarContent = (avatarEnabled, avatarUrl, fallbackUrl, altText, isUserData = false) => {
      if (!avatarEnabled) return null;
      if ((0,_helpers__WEBPACK_IMPORTED_MODULE_2__.isEmoji)(avatarUrl)) {
        return renderEmoji(avatarUrl);
      }
      const src = getAvatarSrc(avatarUrl, isUserData) || fallbackUrl;
      if (!src) return null;
      return renderAvatar(src, altText);
    };
    if (isAi) {
      const aiAvatarContent = getAvatarContent(aiAvatar, aiAvatarUrl, iconUrl, "AI Avatar");
      if (aiAvatarContent) {
        if (aiAvatarUrl === null && iconUrl) {
          console.warn('Using iconUrl as a temporary fallback for AI avatar. Please set aiAvatarUrl.');
        }
        return aiAvatarContent;
      }
      return renderName(aiName);
    }
    if (!isGuest) {
      const userAvatarContent = getAvatarContent(userAvatar, userAvatarUrl, userData === null || userData === void 0 ? void 0 : userData.AVATAR_URL, "User Avatar", true);
      if (userAvatarContent) return userAvatarContent;
      return renderName(formatName(userName, guestName, userData));
    }
    if (isGuest) {
      const guestAvatarContent = getAvatarContent(guestAvatar, guestAvatarUrl, null, "Guest Avatar");
      if (guestAvatarContent) return guestAvatarContent;
      return renderName(guestName || "Guest");
    }
  }, [role, aiName, userName, guestName, userData, iconUrl, aiAvatar, userAvatar, guestAvatar, aiAvatarUrl, userAvatarUrl, guestAvatarUrl, pluginUrl]);
  return /*#__PURE__*/React.createElement("span", {
    className: "mwai-name"
  }, formattedOutput);
};
function formatName(template, guestName, userData) {
  if (!userData || Object.keys(userData).length === 0) {
    return guestName || template || "Guest";
  }
  return Object.entries(userData).reduce((acc, [placeholder, value]) => {
    const realPlaceholder = `{${placeholder}}`;
    return acc.includes(realPlaceholder) ? acc.replace(realPlaceholder, value) : acc;
  }, template);
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotName);

/***/ }),

/***/ "./app/js/chatbot/ChatbotRealtime.js":
/*!*******************************************!*\
  !*** ./app/js/chatbot/ChatbotRealtime.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/play.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/loader.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/square.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/pause.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/users.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/captions.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/bug.js");
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _AudioVisualizer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./AudioVisualizer */ "./app/js/chatbot/AudioVisualizer.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
// Previous: 2.7.3
// Current: 2.7.7

const {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect
} = wp.element;





const DEBUG_LEVELS = {
  none: 0,
  low: 1,
  normal: 2,
  high: 3,
  verbose: 4
};
const CURRENT_DEBUG = DEBUG_LEVELS.low;
function debugLog(level, ...args) {
  if (CURRENT_DEBUG >= level) console.log(...args);
}
function parseUsage(usage) {
  if (!usage) return null;
  const {
    input_token_details: {
      text_tokens: textIn = 0,
      audio_tokens: audioIn = 0,
      cached_tokens_details: {
        text_tokens: cachedText = 0,
        audio_tokens: cachedAudio = 0
      } = {}
    } = {},
    output_token_details: {
      text_tokens: textOut = 0,
      audio_tokens: audioOut = 0
    } = {}
  } = usage;
  return {
    text_input_tokens: textIn,
    audio_input_tokens: audioIn,
    text_output_tokens: textOut,
    audio_output_tokens: audioOut,
    text_cached_tokens: cachedText,
    audio_cached_tokens: cachedAudio
  };
}
function getChatbotRepresentation(state, role = 'user') {
  const {
    pluginUrl,
    iconUrl,
    userData,
    userName,
    aiName,
    guestName,
    userAvatar,
    aiAvatar,
    guestAvatar,
    userAvatarUrl,
    aiAvatarUrl,
    guestAvatarUrl
  } = state;
  const getAvatarSrc = (url, isUserData = false) => {
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_0__.isURL)(url)) return url;
    if (url && !(0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isEmoji)(url)) return isUserData ? url : `${pluginUrl}/images/${url}`;
    return null;
  };
  const getRepresentation = (name, avatarEnabled, avatarUrl, fallbackUrl, isUserData = false) => {
    if (avatarEnabled) {
      const src = getAvatarSrc(avatarUrl, isUserData) || fallbackUrl;
      if (src) return {
        emoji: null,
        text: null,
        image: src,
        use: 'image'
      };
    }
    if ((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isEmoji)(name)) return {
      emoji: name,
      text: null,
      image: null,
      use: 'emoji'
    };
    return {
      emoji: null,
      text: name,
      image: null,
      use: 'text'
    };
  };
  if (role === 'assistant') {
    return getRepresentation(aiName, aiAvatar, aiAvatarUrl, iconUrl);
  }
  if (userData) {
    const name = formatName(userName, guestName, userData);
    return getRepresentation(name, userAvatar, userAvatarUrl, userData === null || userData === void 0 ? void 0 : userData.AVATAR_URL, true);
  }
  if (!userData && role === 'user') {
    return getRepresentation(guestName || 'Guest', guestAvatar, guestAvatarUrl, null);
  }
  return {
    emoji: null,
    text: 'Unknown',
    image: null,
    use: 'text'
  };
}
function formatName(template, guestName, userData) {
  if (!userData || Object.keys(userData).length === 0) return guestName || template || 'Guest';
  return Object.entries(userData).reduce((acc, [key, val]) => {
    const placeholder = `{${key}}`;
    return acc.includes(placeholder) ? acc.replace(placeholder, val) : acc;
  }, template);
}
const ChatbotRealtime = () => {
  const {
    state,
    actions
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_2__.useChatbotContext)();
  const {
    busy,
    locked,
    open,
    popup
  } = state;
  const {
    onStartRealtimeSession,
    onRealtimeFunctionCallback,
    onCommitStats,
    onCommitDiscussions
  } = actions;
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [whoIsSpeaking, setWhoIsSpeaking] = useState(null);
  const [statistics, setStatistics] = useState({
    text_input_tokens: 0,
    audio_input_tokens: 0,
    text_output_tokens: 0,
    audio_output_tokens: 0,
    text_cached_tokens: 0,
    audio_cached_tokens: 0
  });
  const [messages, setMessages] = useState([]);
  const processedItemIdsRef = useRef(new Set());
  const pcRef = useRef(null);
  const dataChannelRef = useRef(null);
  const localStreamRef = useRef(null);
  const [showOptions, setShowOptions] = useState(true);
  const [showUsers, setShowUsers] = useState(true);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [assistantStream, setAssistantStream] = useState(null);
  const functionCallbacksRef = useRef([]);
  const userUI = useMemo(() => getChatbotRepresentation(state, 'user'), [state]);
  const assistantUI = useMemo(() => getChatbotRepresentation(state, 'assistant'), [state]);
  useEffect(() => {
    if (!open && isSessionActive && popup) stopRealtimeConnection();
  }, [open, popup, isSessionActive]);
  const commitStatsToServer = useCallback(async usageStats => {
    await onCommitStats(usageStats);
  }, [onCommitStats]);
  const enableAudioTranscription = useCallback(() => {
    if (!dataChannelRef.current || dataChannelRef.current.readyState !== 'open') {
      console.error('Data channel is not open yet; cannot enable transcription.');
      return;
    }
    dataChannelRef.current.send(JSON.stringify({
      type: 'session.update',
      session: {
        input_audio_transcription: {
          model: 'whisper-1'
        }
      }
    }));
    debugLog(DEBUG_LEVELS.low, 'Sent session.update to enable Whisper.');
  }, []);
  const handleFunctionCall = useCallback(async (callId, functionName, rawArgs) => {
    let parsedArgs = {};
    try {
      parsedArgs = JSON.parse(rawArgs || '{}');
    } catch (err) {
      console.error('Could not parse function arguments.', rawArgs);
    }
    const fns = functionCallbacksRef.current;
    const cb = fns.find(f => f.name === functionName);
    if (!cb) {
      console.error(`No match for callback: '${functionName}'.`);
      return;
    }
    try {
      var _dataChannelRef$curre;
      const result = await onRealtimeFunctionCallback(cb.id, cb.type, cb.name, cb.target, parsedArgs);
      if (!(result !== null && result !== void 0 && result.success)) {
        console.error('Callback failed.', result === null || result === void 0 ? void 0 : result.message);
        return;
      }
      const functionOutput = result.data;
      if (((_dataChannelRef$curre = dataChannelRef.current) === null || _dataChannelRef$curre === void 0 ? void 0 : _dataChannelRef$curre.readyState) === 'open') {
        debugLog(DEBUG_LEVELS.low, 'Send callback value:', functionOutput);
        dataChannelRef.current.send(JSON.stringify({
          type: 'conversation.item.create',
          item: {
            type: 'function_call_output',
            call_id: callId,
            output: JSON.stringify(functionOutput)
          }
        }));
        dataChannelRef.current.send(JSON.stringify({
          type: 'response.create',
          response: {
            instructions: "Reply based on the function's output."
          }
        }));
      }
    } catch (err) {
      console.error('Error in handleFunctionCall.', err);
    }
  }, [onRealtimeFunctionCallback]);
  const startRealtimeConnection = useCallback(async (clientSecret, model) => {
    setIsConnecting(true);
    const pc = new RTCPeerConnection();
    pcRef.current = pc;
    let ms;
    try {
      ms = await navigator.mediaDevices.getUserMedia({
        audio: true
      });
      localStreamRef.current = ms;
      ms.getTracks().forEach(track => pc.addTrack(track, ms));
    } catch (err) {
      console.error('Error accessing microphone.', err);
      setIsConnecting(false);
      return;
    }
    pc.ontrack = event => {
      const audioEl = document.getElementById('mwai-audio');
      if (audioEl) audioEl.srcObject = event.streams[0];
      setAssistantStream(event.streams[0]);
    };
    const dataChannel = pc.createDataChannel('oai-events');
    dataChannelRef.current = dataChannel;
    dataChannel.addEventListener('open', () => {
      debugLog(DEBUG_LEVELS.low, 'Data channel open.');
      enableAudioTranscription();
    });
    dataChannel.addEventListener('message', e => {
      let msg;
      try {
        msg = JSON.parse(e.data);
      } catch (err) {
        console.error('Could not parse Realtime message.', e.data);
        return;
      }
      if (CURRENT_DEBUG >= DEBUG_LEVELS.high) {
        console.log('Incoming message from Realtime API.', msg);
      } else if (CURRENT_DEBUG === DEBUG_LEVELS.low) {
        var _msg$type;
        const isMajor = ((_msg$type = msg.type) === null || _msg$type === void 0 ? void 0 : _msg$type.endsWith('.done')) || msg.type === 'input_audio_buffer.committed' || msg.type === 'conversation.item.input_audio_transcription.completed' || msg.type === 'response.done';
        if (isMajor) console.log('Key event from Realtime API.', msg);
      }
      switch (msg.type) {
        case 'input_audio_buffer.committed':
          {
            const itemId = msg.item_id;
            if (!processedItemIdsRef.current.has(itemId)) {
              processedItemIdsRef.current.add(itemId);
              setMessages(prev => [...prev, {
                id: itemId,
                role: 'user',
                content: '[Audio]'
              }]);
            }
            setWhoIsSpeaking('user');
            break;
          }
        case 'conversation.item.input_audio_transcription.completed':
          {
            const itemId = msg.item_id;
            const transcript = (msg.transcript || '[Audio]').trim();
            setMessages(prev => prev.map(m => m.id === itemId && m.role === 'user' ? {
              ...m,
              content: transcript
            } : m));
            break;
          }
        case 'response.audio_transcript.done':
          {
            const itemId = msg.item_id;
            const transcript = (msg.transcript || '[Audio]').trim();
            setWhoIsSpeaking('assistant');
            if (!processedItemIdsRef.current.has(itemId)) {
              processedItemIdsRef.current.add(itemId);
              setMessages(prev => [...prev, {
                id: itemId,
                role: 'assistant',
                content: transcript
              }]);
            }
            break;
          }
        case 'response.function_call_arguments.done':
          {
            const {
              call_id,
              name,
              arguments: rawArgs
            } = msg;
            debugLog(DEBUG_LEVELS.low, 'Function call requested.', call_id, name);
            handleFunctionCall(call_id, name, rawArgs);
            break;
          }
        case 'response.done':
          {
            const resp = msg.response;
            if (resp !== null && resp !== void 0 && resp.usage) {
              const usageStats = parseUsage(resp.usage);
              if (usageStats) {
                setStatistics(prev => {
                  // Introducing a bug: using prev directly in multiple setState calls
                  const updated = {
                    text_input_tokens: (prev.text_input_tokens || 0) + usageStats.text_input_tokens,
                    audio_input_tokens: (prev.audio_input_tokens || 0) + usageStats.audio_input_tokens,
                    text_output_tokens: (prev.text_output_tokens || 0) + usageStats.text_output_tokens,
                    audio_output_tokens: (prev.audio_output_tokens || 0) + usageStats.audio_output_tokens,
                    text_cached_tokens: (prev.text_cached_tokens || 0) + usageStats.text_cached_tokens,
                    audio_cached_tokens: (prev.audio_cached_tokens || 0) + usageStats.audio_cached_tokens
                  };
                  commitStatsToServer(updated);
                  return updated;
                });
              }
            }
            setWhoIsSpeaking('user');
            break;
          }
        default:
          break;
      }
    });
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    const baseUrl = 'https://api.openai.com/v1/realtime';
    const chosenModel = model || 'gpt-4o-preview-2024-12-17';
    const sdpResponse = await fetch(`${baseUrl}?model=${chosenModel}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${clientSecret}`,
        'Content-Type': 'application/sdp'
      },
      body: offer.sdp
    });
    if (!sdpResponse.ok) {
      console.error('SDP exchange failed.', sdpResponse);
      setIsConnecting(false);
      return;
    }
    const answerSDP = await sdpResponse.text();
    await pc.setRemoteDescription({
      type: 'answer',
      sdp: answerSDP
    });
    debugLog(DEBUG_LEVELS.low, 'Realtime connection established.');
    setIsConnecting(false);
    setIsSessionActive(true);
    setIsPaused(false);
    setWhoIsSpeaking('user');
  }, [enableAudioTranscription, handleFunctionCall, commitStatsToServer]);
  const stopRealtimeConnection = useCallback(() => {
    try {
      if (pcRef.current) {
        pcRef.current.close();
        pcRef.current = null;
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }
      dataChannelRef.current = null;
      setIsConnecting(false);
      setIsSessionActive(false);
      setIsPaused(false);
      setWhoIsSpeaking(null);
      console.log('Messages:', messages);
      console.log('Statistics:', statistics);
      onCommitDiscussions(messages);
      setMessages([]);
      setStatistics({
        text_input_tokens: 0,
        audio_input_tokens: 0,
        text_output_tokens: 0,
        audio_output_tokens: 0,
        text_cached_tokens: 0,
        audio_cached_tokens: 0
      });
      debugLog(DEBUG_LEVELS.low, 'Stopped Realtime connection.');
    } catch (err) {
      console.error('Error stopping connection.', err);
    }
  }, [messages, statistics, onCommitDiscussions]);
  const togglePause = useCallback(() => {
    if (!localStreamRef.current) return;
    const tracks = localStreamRef.current.getAudioTracks();
    if (!tracks.length) return;
    if (isPaused) {
      tracks.forEach(track => {
        track.enabled = true;
      });
      debugLog(DEBUG_LEVELS.low, 'Resumed microphone.');
      setIsPaused(false);
    } else {
      tracks.forEach(track => {
        track.enabled = false;
      });
      debugLog(DEBUG_LEVELS.low, 'Paused microphone.');
      setIsPaused(true);
    }
  }, [isPaused]);
  const handlePlay = useCallback(async () => {
    setIsConnecting(true);
    try {
      const data = await onStartRealtimeSession();
      if (!(data !== null && data !== void 0 && data.success)) {
        console.error('Could not start realtime session.', data);
        setIsConnecting(false);
        return;
      }
      // Introducing a bug: accidentally overwriting callbacks with empty array
      functionCallbacksRef.current = data.function_callbacks || [];
      setSessionId(data.session_id);
      await startRealtimeConnection(data.client_secret, data.model);
    } catch (err) {
      console.error('Error in handlePlay.', err);
      setIsConnecting(false);
    }
  }, [onStartRealtimeSession, startRealtimeConnection]);
  const handleStop = useCallback(() => stopRealtimeConnection(), [stopRealtimeConnection]);
  const toggleUsers = useCallback(() => setShowUsers(p => !p), []);
  const toggleStatistics = useCallback(() => setShowStatistics(p => !p), []);
  const toggleCaptions = useCallback(() => setShowCaptions(p => !p), []);
  const pauseButtonClass = useMemo(() => isPaused ? 'mwai-pause mwai-active' : 'mwai-pause', [isPaused]);
  const latestAssistantMessage = useMemo(() => {
    const reversed = [...messages].reverse();
    const last = reversed.find(m => m.role === 'assistant');
    if (!last) return '...';
    if (last.content.length > 256) return `${last.content.slice(0, 256)}...`;
    return last.content;
  }, [messages]);
  const usersOptionClasses = useMemo(() => showUsers ? 'mwai-option mwai-option-users mwai-active' : 'mwai-option mwai-option-users', [showUsers]);
  const captionsOptionClasses = useMemo(() => showCaptions ? 'mwai-option mwai-option-captions mwai-active' : 'mwai-option mwai-option-captions', [showCaptions]);
  const statisticsOptionClasses = useMemo(() => showStatistics ? 'mwai-option mwai-option-statistics mwai-active' : 'mwai-option mwai-option-statistics', [showStatistics]);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("audio", {
    id: "mwai-audio",
    autoPlay: true
  }), showUsers && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(_AudioVisualizer__WEBPACK_IMPORTED_MODULE_3__["default"], {
    assistantStream: assistantStream,
    userUI: userUI,
    assistantUI: assistantUI,
    userStream: localStreamRef.current
  })), /*#__PURE__*/React.createElement("div", {
    className: "mwai-controls"
  }, !isSessionActive && !isConnecting && /*#__PURE__*/React.createElement("button", {
    onClick: handlePlay,
    className: "mwai-play",
    disabled: busy || locked,
    "aria-label": "Play"
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_4__["default"], {
    size: 16
  })), isConnecting && /*#__PURE__*/React.createElement("button", {
    className: "mwai-play",
    disabled: true
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_5__["default"], {
    size: 16,
    style: {
      animation: 'spin 0.8s linear infinite'
    }
  })), isSessionActive && !isConnecting && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("button", {
    onClick: handleStop,
    className: "mwai-stop",
    disabled: busy || locked,
    "aria-label": "Stop"
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_6__["default"], {
    size: 16
  })), /*#__PURE__*/React.createElement("button", {
    onClick: togglePause,
    className: pauseButtonClass,
    disabled: busy || locked,
    "aria-label": "Pause"
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_7__["default"], {
    size: 16
  })))), showCaptions && latestAssistantMessage && latestAssistantMessage.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "mwai-last-transcript"
  }, latestAssistantMessage), showStatistics && /*#__PURE__*/React.createElement("div", {
    className: "mwai-statistics"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Text In"), /*#__PURE__*/React.createElement("span", null, statistics.text_input_tokens)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Text Out"), /*#__PURE__*/React.createElement("span", null, statistics.text_output_tokens)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Text Cached"), /*#__PURE__*/React.createElement("span", null, statistics.text_cached_tokens)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Audio In"), /*#__PURE__*/React.createElement("span", null, statistics.audio_input_tokens)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Audio Out"), /*#__PURE__*/React.createElement("span", null, statistics.audio_output_tokens)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", null, "Audio Cached"), /*#__PURE__*/React.createElement("span", null, statistics.audio_cached_tokens))), showOptions && /*#__PURE__*/React.createElement("div", {
    className: "mwai-options"
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_8__["default"], {
    size: 13,
    title: "Show Users",
    className: usersOptionClasses,
    onClick: toggleUsers
  }), /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_9__["default"], {
    size: 18,
    title: "Show Captions",
    className: captionsOptionClasses,
    onClick: toggleCaptions
  }), /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_10__["default"], {
    size: 14,
    title: "Show Statistics",
    className: statisticsOptionClasses,
    onClick: toggleStatistics
  })));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotRealtime);

/***/ }),

/***/ "./app/js/chatbot/ChatbotReply.js":
/*!****************************************!*\
  !*** ./app/js/chatbot/ChatbotReply.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var markdown_to_jsx__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! markdown-to-jsx */ "./node_modules/markdown-to-jsx/dist/index.modern.js");
/* harmony import */ var _app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @app/chatbot/helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _app_chatbot_ChatbotSpinners__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/chatbot/ChatbotSpinners */ "./app/js/chatbot/ChatbotSpinners.js");
/* harmony import */ var _app_helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/helpers */ "./app/js/helpers.js");
/* harmony import */ var _app_components_ReplyActions__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @app/components/ReplyActions */ "./app/js/components/ReplyActions.js");
/* harmony import */ var _ChatbotName__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChatbotName */ "./app/js/chatbot/ChatbotName.js");
// Previous: 2.7.5
// Current: 2.7.7

const {
  useState,
  useMemo,
  useEffect,
  useRef
} = wp.element;







const LinkContainer = ({
  href,
  children
}) => {
  if (!href) {
    return /*#__PURE__*/React.createElement("span", null, children);
  }
  const target = '_blank';
  const isFile = String(children) === "Uploaded File";
  if (isFile) {
    const filename = href.split('/').pop();
    return /*#__PURE__*/React.createElement("a", {
      href: href,
      target: target,
      rel: "noopener noreferrer",
      className: "mwai-filename"
    }, /*#__PURE__*/React.createElement("span", null, "\u2713 ", filename));
  }
  return /*#__PURE__*/React.createElement("a", {
    href: href,
    target: target,
    rel: "noopener noreferrer"
  }, children);
};
const RawMessage = ({
  message,
  onRendered = () => {}
}) => {
  const {
    state
  } = (0,_app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__.useChatbotContext)();
  const {
    copyButton
  } = state;
  const [isLongProcess] = useState(message.isQuerying || message.isStreaming);
  const isQuerying = message.isQuerying;
  const isStreaming = message.isStreaming;
  let content = message.content ?? "";
  const matches = (content.match(/```/g) || []).length;
  if (matches % 2 !== 0) {
    content += "\n```";
  } else if (message.isStreaming) {
    content += "<BlinkingCursor />";
  }
  useEffect(() => {
    if (!isLongProcess) {
      onRendered();
    } else if (isLongProcess && !isQuerying && !isStreaming) {
      onRendered();
    }
  }, [isLongProcess, isQuerying, isStreaming]);
  const markdownOptions = useMemo(() => {
    const options = {
      overrides: {
        BlinkingCursor: {
          component: _app_helpers__WEBPACK_IMPORTED_MODULE_1__.BlinkingCursor
        },
        a: {
          component: LinkContainer
        },
        img: {
          props: {
            onError: e => {
              const src = e.target.src;
              const isImage = /\.(jpeg|jpg|gif|png)$/.test(src);
              if (isImage) {
                e.target.src = "https://placehold.co/600x200?text=Expired+Image";
                return;
              }
            },
            className: "mwai-image"
          }
        }
      }
    };
    return options;
  }, []);
  const renderedContent = useMemo(() => {
    let out = "";
    try {
      out = (0,markdown_to_jsx__WEBPACK_IMPORTED_MODULE_2__.compiler)(content, markdownOptions);
    } catch (e) {
      console.error("Crash in markdown-to-jsx! Reverting to plain text.", {
        e,
        content
      });
      out = content;
    }
    return out;
  }, [content, markdownOptions]);
  if (isQuerying) {
    return /*#__PURE__*/React.createElement(_app_chatbot_ChatbotSpinners__WEBPACK_IMPORTED_MODULE_3__.BouncingDots, null);
  }
  if (isStreaming && !content) {
    return /*#__PURE__*/React.createElement(_app_chatbot_ChatbotSpinners__WEBPACK_IMPORTED_MODULE_3__.BouncingDots, null);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ChatbotName__WEBPACK_IMPORTED_MODULE_4__["default"], {
    role: message.role
  }), /*#__PURE__*/React.createElement(_app_components_ReplyActions__WEBPACK_IMPORTED_MODULE_5__["default"], {
    content: message.content,
    enabled: copyButton,
    className: "mwai-text"
  }, renderedContent));
};
const ImagesMessage = ({
  message,
  onRendered = () => {}
}) => {
  const [images, setImages] = useState(message === null || message === void 0 ? void 0 : message.images);
  useEffect(() => {
    onRendered();
  });
  const handleImageError = index => {
    const placeholderImage = "https://placehold.co/600x200?text=Expired+Image";
    setImages(prevImages => prevImages.map((img, i) => i === index ? placeholderImage : img));
  };
  if (message.isQuerying) {
    return /*#__PURE__*/React.createElement(_app_chatbot_ChatbotSpinners__WEBPACK_IMPORTED_MODULE_3__.BouncingDots, null);
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_ChatbotName__WEBPACK_IMPORTED_MODULE_4__["default"], {
    role: message.role
  }), /*#__PURE__*/React.createElement("span", {
    className: "mwai-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mwai-gallery"
  }, images === null || images === void 0 ? void 0 : images.map((image, index) => /*#__PURE__*/React.createElement("a", {
    key: index,
    href: image,
    target: "_blank",
    rel: "noopener noreferrer"
  }, /*#__PURE__*/React.createElement("img", {
    key: index,
    src: image,
    onError: () => handleImageError(index)
  }))))));
};
const ChatbotReply = ({
  message,
  conversationRef
}) => {
  var _message$images;
  const {
    state
  } = (0,_app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__.useChatbotContext)();
  const {
    typewriter
  } = state;
  const css = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_6__.useClasses)();
  const mainElement = useRef();
  const classes = css('mwai-reply', {
    'mwai-ai': message.role === 'assistant',
    'mwai-user': message.role === 'user',
    'mwai-system': message.role === 'system'
  });
  const isImages = (message === null || message === void 0 || (_message$images = message.images) === null || _message$images === void 0 ? void 0 : _message$images.length) > 0;
  const onRendered = () => {
    if (!mainElement.current) {
      return;
    }
    if (message.isQuerying) {
      return;
    }
    if (mainElement.current.classList.contains('mwai-rendered')) {
      return;
    }
    if (typeof hljs !== 'undefined') {
      mainElement.current.classList.add('mwai-rendered');
      const selector = mainElement.current.querySelectorAll('pre code');
      selector.forEach(el => {
        hljs.highlightElement(el);
      });
    }
  };
  const output = useMemo(() => {
    if (message.role === 'user') {
      return /*#__PURE__*/React.createElement("div", {
        ref: mainElement,
        className: classes
      }, /*#__PURE__*/React.createElement(RawMessage, {
        message: message
      }));
    }
    if (message.role === 'assistant') {
      if (isImages) {
        return /*#__PURE__*/React.createElement("div", {
          ref: mainElement,
          className: classes
        }, /*#__PURE__*/React.createElement(ImagesMessage, {
          message: message,
          conversationRef: conversationRef,
          onRendered: onRendered
        }));
      }
      // else if (typewriter && !message.isStreaming) {
      //   console.warn("The Typewriter effect is deprecated. Use Streaming instead.");
      //   return <div ref={mainElement} className={classes}>
      //     <TypedMessage message={message} conversationRef={conversationRef} onRendered={onRendered} />
      //   </div>;
      // }
      return /*#__PURE__*/React.createElement("div", {
        ref: mainElement,
        className: classes
      }, /*#__PURE__*/React.createElement(RawMessage, {
        message: message,
        conversationRef: conversationRef,
        onRendered: onRendered
      }));
    }
    if (message.role === 'system') {
      return /*#__PURE__*/React.createElement("div", {
        ref: mainElement,
        className: classes
      }, /*#__PURE__*/React.createElement(RawMessage, {
        message: message,
        conversationRef: conversationRef,
        onRendered: onRendered
      }));
    }
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("i", null, "Unhandled role."));
  }, [message, conversationRef, isImages, typewriter]);
  return output;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotReply);

/***/ }),

/***/ "./app/js/chatbot/ChatbotSpinners.js":
/*!*******************************************!*\
  !*** ./app/js/chatbot/ChatbotSpinners.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BouncingDots: () => (/* binding */ BouncingDots)
/* harmony export */ });
// Previous: 1.5.5
// Current: 2.7.7

const BouncingDots = () => {
  const bouncingLoaderStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: 26
  };
  const bouncingDotStyles = {
    width: 9,
    height: 9,
    margin: '5px 0px 0px 5px',
    borderRadius: '50%',
    backgroundColor: '#a3a1a1',
    opacity: 1,
    animation: 'bouncing-loader 0.4s infinite alternate'
  };
  const animationDelays = ['0.1s', '0.2s', '0.3s'];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, `
          @keyframes bouncing-loader {
            to {
              opacity: 0.6;
              transform: translateY(-10px);
            }
          }
        `), /*#__PURE__*/React.createElement("div", {
    style: bouncingLoaderStyles
  }, animationDelays.map((delay, index) => /*#__PURE__*/React.createElement("div", {
    key: index,
    style: {
      ...bouncingDotStyles,
      animationDelay: delay
    }
  }))));
};


/***/ }),

/***/ "./app/js/chatbot/ChatbotSubmit.js":
/*!*****************************************!*\
  !*** ./app/js/chatbot/ChatbotSubmit.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/send.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/eraser.js");
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
// Previous: 2.6.9
// Current: 2.7.7

// React & Vendor Libs
const {
  useMemo,
  useCallback
} = wp.element;


const ChatbotSubmit = () => {
  const {
    state,
    actions
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__.useChatbotContext)();
  const {
    onClear,
    onSubmitAction,
    setIsListening
  } = actions;
  const {
    textClear,
    textSend,
    uploadedFile,
    inputText,
    messages,
    isListening,
    timeElapsed,
    busy,
    submitButtonConf,
    locked
  } = state;
  const isFileUploading = !!(uploadedFile !== null && uploadedFile !== void 0 && uploadedFile.uploadProgress);
  const hasFileUploaded = !!(uploadedFile !== null && uploadedFile !== void 0 && uploadedFile.uploadedId);
  const clearMode = !hasFileUploaded && inputText.length < 1 && (messages === null || messages === void 0 ? void 0 : messages.length) > 1;
  const buttonContent = useMemo(() => {
    if (busy) {
      return timeElapsed ? /*#__PURE__*/React.createElement("div", {
        className: "mwai-timer"
      }, timeElapsed) : null;
    }
    // If there are text values for the button, use them
    if (submitButtonConf !== null && submitButtonConf !== void 0 && submitButtonConf.imageSend && submitButtonConf !== null && submitButtonConf !== void 0 && submitButtonConf.imageClear) {
      return /*#__PURE__*/React.createElement("img", {
        src: clearMode ? submitButtonConf.imageClear : submitButtonConf.imageSend,
        alt: clearMode ? textClear : textSend
      });
    }
    // If there are no text or images, use the default send icon
    if (!clearMode && !textSend) {
      return /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
        size: "20",
        style: {
          marginLeft: 10
        }
      });
    }
    if (clearMode && !textClear) {
      return /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
        size: "20"
      });
    }
    return /*#__PURE__*/React.createElement("span", null, clearMode ? textClear : textSend);
  }, [busy, timeElapsed, clearMode, textClear, textSend, submitButtonConf]);
  const buttonClassName = useMemo(() => {
    return `mwai-input-submit ${busy ? 'mwai-busy' : ''}`;
  }, [busy]);
  const onSubmitClick = useCallback(() => {
    if (isListening) {
      setIsListening(false);
    }
    if (clearMode) {
      onClear();
    } else {
      onSubmitAction();
    }
  }, [clearMode, isListening, onClear, onSubmitAction, setIsListening]);
  const handleClick = useCallback(() => {
    if (!busy) {
      onSubmitClick();
    }
  }, [busy, onSubmitClick]);
  return /*#__PURE__*/React.createElement("button", {
    className: buttonClassName,
    disabled: busy || isFileUploading || locked,
    onClick: handleClick
  }, buttonContent);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotSubmit);

/***/ }),

/***/ "./app/js/chatbot/ChatbotSystem.js":
/*!*****************************************!*\
  !*** ./app/js/chatbot/ChatbotSystem.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _app_chatbot_ChatbotUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/chatbot/ChatbotUI */ "./app/js/chatbot/ChatbotUI.js");
// Previous: 1.4.7
// Current: 1.9.8



const ChatbotSystem = props => {
  return /*#__PURE__*/React.createElement(_app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__.ChatbotContextProvider, props, /*#__PURE__*/React.createElement(_app_chatbot_ChatbotUI__WEBPACK_IMPORTED_MODULE_1__["default"], props));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotSystem);

/***/ }),

/***/ "./app/js/chatbot/ChatbotTrigger.js":
/*!******************************************!*\
  !*** ./app/js/chatbot/ChatbotTrigger.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ChatbotContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helpers */ "./app/js/helpers.js");
// Previous: 2.4.6
// Current: 2.4.7

// React & Vendor Libs
const {
  useMemo,
  useEffect
} = wp.element;



const ChatbotTrigger = () => {
  const {
    state,
    actions
  } = (0,_ChatbotContext__WEBPACK_IMPORTED_MODULE_0__.useChatbotContext)();
  const {
    isWindow,
    iconText,
    showIconMessage,
    iconAlt,
    iconUrl,
    open
  } = state;
  const {
    setShowIconMessage,
    setOpen
  } = actions;
  useEffect(() => {
    if (open && showIconMessage) {
      setShowIconMessage(false);
    }
  }, [open, setShowIconMessage, showIconMessage]);
  const triggerContent = useMemo(() => {
    if (!isWindow) {
      return null;
    }
    const renderIcon = () => {
      if ((0,_helpers__WEBPACK_IMPORTED_MODULE_1__.isEmoji)(iconUrl)) {
        return /*#__PURE__*/React.createElement("div", {
          className: "mwai-icon mwai-emoji",
          style: {
            fontSize: '48px',
            lineHeight: '64px',
            width: '64px',
            height: '64px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }
        }, iconUrl);
      } else {
        return /*#__PURE__*/React.createElement("img", {
          className: "mwai-icon",
          width: "64",
          height: "64",
          alt: iconAlt,
          src: iconUrl
        });
      }
    };

    // TODO: Let's remove mwai-open-button at some point.
    return /*#__PURE__*/React.createElement("div", {
      className: "mwai-trigger mwai-open-button"
    }, /*#__PURE__*/React.createElement(_helpers__WEBPACK_IMPORTED_MODULE_2__.TransitionBlock, {
      className: "mwai-icon-text-container",
      if: iconText && showIconMessage
    }, /*#__PURE__*/React.createElement("div", {
      className: "mwai-icon-text-close",
      onClick: () => setShowIconMessage(false)
    }, "\u2715"), /*#__PURE__*/React.createElement("div", {
      className: "mwai-icon-text",
      onClick: () => setOpen(true)
    }, iconText)), /*#__PURE__*/React.createElement("div", {
      className: "mwai-icon-container",
      onClick: () => setOpen(true)
    }, renderIcon()));
  }, [isWindow, iconText, showIconMessage, iconAlt, iconUrl, setShowIconMessage, setOpen]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, triggerContent);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotTrigger);

/***/ }),

/***/ "./app/js/chatbot/ChatbotUI.js":
/*!*************************************!*\
  !*** ./app/js/chatbot/ChatbotUI.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var markdown_to_jsx__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! markdown-to-jsx */ "./node_modules/markdown-to-jsx/dist/index.modern.js");
/* harmony import */ var _app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/chatbot/ChatbotContext */ "./app/js/chatbot/ChatbotContext.js");
/* harmony import */ var _ChatbotReply__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ChatbotReply */ "./app/js/chatbot/ChatbotReply.js");
/* harmony import */ var _ChatbotInput__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ChatbotInput */ "./app/js/chatbot/ChatbotInput.js");
/* harmony import */ var _ChatbotSubmit__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ChatbotSubmit */ "./app/js/chatbot/ChatbotSubmit.js");
/* harmony import */ var _ChatbotHeader__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ChatbotHeader */ "./app/js/chatbot/ChatbotHeader.js");
/* harmony import */ var _ChatbotTrigger__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ChatbotTrigger */ "./app/js/chatbot/ChatbotTrigger.js");
/* harmony import */ var _ChatUploadIcon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ChatUploadIcon */ "./app/js/chatbot/ChatUploadIcon.js");
/* harmony import */ var _ChatbotRealtime__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ChatbotRealtime */ "./app/js/chatbot/ChatbotRealtime.js");
// Previous: 2.6.9
// Current: 2.7.0

const {
  useState,
  useMemo,
  useLayoutEffect,
  useCallback,
  useEffect,
  useRef
} = wp.element;










const markdownOptions = {
  overrides: {
    a: {
      props: {
        target: "_blank"
      }
    }
  }
};
const isImage = file => file.type.startsWith('image/');
const isDocument = file => {
  const allowedDocumentTypes = ['text/x-c', 'text/x-csharp', 'text/x-c++', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/html', 'text/x-java', 'application/json', 'text/markdown', 'application/pdf', 'text/x-php', 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'text/x-python', 'text/x-script.python', 'text/x-ruby', 'text/x-tex', 'text/plain', 'text/css', 'text/javascript', 'application/x-sh', 'application/typescript'];
  return allowedDocumentTypes.includes(file.type);
};
const ChatbotUI = props => {
  const css = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useClasses)();
  const {
    style
  } = props;
  const [autoScroll, setAutoScroll] = useState(true);
  const {
    state,
    actions
  } = (0,_app_chatbot_ChatbotContext__WEBPACK_IMPORTED_MODULE_1__.useChatbotContext)();
  const {
    theme,
    botId,
    customId,
    messages,
    textCompliance,
    isWindow,
    fullscreen,
    iconPosition,
    iconBubble,
    shortcuts,
    blocks,
    imageUpload,
    fileSearch,
    fileUpload,
    draggingType,
    isBlocked,
    virtualKeyboardFix,
    isRealtime,
    windowed,
    cssVariables,
    error,
    conversationRef,
    open,
    busy,
    uploadIconPosition,
    chatbotInputRef
  } = state;
  const {
    resetError,
    onSubmit,
    setIsBlocked,
    setDraggingType,
    onUploadFile
  } = actions;
  const themeStyle = useMemo(() => (theme === null || theme === void 0 ? void 0 : theme.type) === 'css' ? theme === null || theme === void 0 ? void 0 : theme.style : null, [theme]);
  const needTools = imageUpload || fileSearch || fileUpload;
  const needsFooter = needTools || textCompliance;
  const timeoutRef = useRef(null);
  const {
    viewportHeight,
    isIOS,
    isAndroid
  } = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useViewport)();
  useEffect(() => {
    if (!virtualKeyboardFix) {
      return;
    }
    if (!(isIOS || isAndroid)) {
      return;
    }
    if (!isWindow) {
      return;
    }
    const scrollableDiv = document.querySelector('.mwai-window');
    if (scrollableDiv) {
      if (open) {
        scrollableDiv.style.height = `${viewportHeight}px`;
        if (isIOS) {
          const scrollToTop = () => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
              window.scrollTo({
                top: 0
              });
              const scrollInterval = setInterval(() => {
                window.scrollTo({
                  top: 0
                });
              }, 100);
              setTimeout(() => {
                clearInterval(scrollInterval);
              }, 1000);
            }
          };
          scrollToTop();
        }
      } else {
        scrollableDiv.style.height = '';
      }
    }
  }, [fullscreen, isAndroid, isIOS, isWindow, open, viewportHeight, virtualKeyboardFix]);
  const baseClasses = css('mwai-chatbot', {
    [`mwai-${theme === null || theme === void 0 ? void 0 : theme.themeId}-theme`]: true,
    'mwai-window': isWindow,
    'mwai-bubble': iconBubble,
    'mwai-open': open,
    'mwai-fullscreen': !windowed || !isWindow && fullscreen,
    'mwai-bottom-left': iconPosition === 'bottom-left',
    'mwai-top-right': iconPosition === 'top-right',
    'mwai-top-left': iconPosition === 'top-left'
  });
  useLayoutEffect(() => {
    if (autoScroll && conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages, autoScroll, conversationRef, busy]);
  const onScroll = () => {
    if (conversationRef.current) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = conversationRef.current;
      const isAtBottom = scrollHeight - scrollTop <= clientHeight + 1;
      setAutoScroll(isAtBottom);
    }
  };
  const executedScripts = useRef(new Set());
  const simpleHash = str => {
    let hash = 0,
      i,
      chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr = str.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  };
  const executeScript = scriptContent => {
    const scriptHash = simpleHash(scriptContent);
    if (executedScripts.current.has(scriptHash)) {
      return;
    }
    // Introduced bug: using innerHTML instead of textContent, allowing injection
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML = scriptContent;
    document.body.appendChild(script);
    executedScripts.current.add(scriptHash);
  };
  useEffect(() => {
    if (blocks && blocks.length > 0) {
      blocks.forEach(block => {
        const {
          type,
          data
        } = block;
        if (type === 'content' && data.script) {
          executeScript(data.script);
        }
      });
    }
  }, [blocks]);
  const messageList = useMemo(() => messages === null || messages === void 0 ? void 0 : messages.map(message => /*#__PURE__*/React.createElement(_ChatbotReply__WEBPACK_IMPORTED_MODULE_2__["default"], {
    key: message.id,
    message: message
  })), [messages]);
  const jsxShortcuts = useMemo(() => {
    if (!shortcuts || shortcuts.length === 0) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "mwai-shortcuts"
    }, shortcuts.map((action, index) => {
      const {
        type,
        data
      } = action;
      const {
        label,
        variant,
        icon,
        className
      } = data ?? {};
      let baseClasses = css('mwai-shortcut', {
        'mwai-success': variant === 'success',
        'mwai-danger': variant === 'danger',
        'mwai-warning': variant === 'warning',
        'mwai-info': variant === 'info'
      });
      if (className) {
        baseClasses += ` ${className}`;
      }
      const iconIsURL = icon && icon.startsWith('http');
      const iconIsEmoji = icon && !iconIsURL && icon.length >= 1 && icon.length <= 2;
      switch (type) {
        case 'message':
          {
            const {
              message
            } = data;
            const onClick = () => {
              onSubmit(message);
            };
            return /*#__PURE__*/React.createElement("button", {
              className: baseClasses,
              key: index,
              onClick: onClick
            }, (iconIsURL || iconIsEmoji) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
              className: "mwai-icon"
            }, iconIsURL && /*#__PURE__*/React.createElement("img", {
              src: icon,
              alt: label || "AI Shortcut"
            }), iconIsEmoji && /*#__PURE__*/React.createElement("span", {
              role: "img",
              "aria-label": "AI Shortcut"
            }, icon)), /*#__PURE__*/React.createElement("div", {
              style: {
                flex: 'auto'
              }
            })), /*#__PURE__*/React.createElement("div", {
              className: "mwai-label"
            }, label || "N/A"));
          }
        case 'callback':
          {
            const {
              onClick: customOnClick
            } = data;
            const onClickHandler = () => {
              if (typeof customOnClick === 'function') {
                customOnClick();
              } else if (typeof customOnClick === 'string') {
                const replacedOnClick = customOnClick.replace(/{CHATBOT_ID}/g, botId);
                const parsedFunction = new Function(`return (${replacedOnClick});`)();
                data.onClick = parsedFunction;
                parsedFunction();
              } else {
                console.warn('No valid callback function provided in data.onClick.');
              }
            };
            return /*#__PURE__*/React.createElement("button", {
              className: baseClasses,
              key: index,
              onClick: onClickHandler
            }, (iconIsURL || iconIsEmoji) && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
              className: "mwai-icon"
            }, iconIsURL && /*#__PURE__*/React.createElement("img", {
              src: icon,
              alt: label || "AI Shortcut"
            }), iconIsEmoji && /*#__PURE__*/React.createElement("span", {
              role: "img",
              "aria-label": "AI Shortcut"
            }, icon)), /*#__PURE__*/React.createElement("div", {
              style: {
                flex: 'auto'
              }
            })), /*#__PURE__*/React.createElement("div", {
              className: "mwai-label"
            }, label || "N/A"));
          }
        default:
          {
            console.warn(`This shortcut type is not supported: ${type}.`);
            return null;
          }
      }
    }));
  }, [css, onSubmit, shortcuts]);
  const jsxBlocks = useMemo(() => {
    if (!blocks || blocks.length === 0) {
      return null;
    }
    return /*#__PURE__*/React.createElement("div", {
      className: "mwai-blocks"
    }, blocks.map((block, index) => {
      const {
        type,
        data
      } = block;
      if (type !== 'content') {
        console.warn(`Block type ${type} is not supported.`);
        return null;
      }
      const {
        html,
        variant
      } = data;
      const baseClasses = css('mwai-block', {
        'mwai-success': variant === 'success',
        'mwai-danger': variant === 'danger',
        'mwai-warning': variant === 'warning',
        'mwai-info': variant === 'info'
      });
      return /*#__PURE__*/React.createElement("div", {
        className: baseClasses,
        key: index,
        dangerouslySetInnerHTML: {
          __html: html
        }
      });
    }));
  }, [css, blocks]);
  const handleDrag = useCallback((event, dragState) => {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.items[0];
    if (dragState) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (imageUpload && isImage(file)) {
        setDraggingType('image');
        setIsBlocked(false);
      } else if ((fileSearch || fileUpload) && isDocument(file)) {
        setDraggingType('document');
        setIsBlocked(false);
      } else {
        setDraggingType(false);
        setIsBlocked(true);
      }
    } else {
      if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          setDraggingType(false);
          setIsBlocked(false);
          timeoutRef.current = null;
        }, 100);
      }
    }
  }, [imageUpload, fileSearch, fileUpload]);
  const handleDrop = useCallback(event => {
    event.preventDefault();
    handleDrag(event, false);
    if (busy) return;
    const file = event.dataTransfer.files[0];
    if (file) {
      if (draggingType === 'image' && imageUpload) {
        onUploadFile(file);
      } else if (draggingType === 'document' && (fileSearch || fileUpload)) {
        onUploadFile(file);
      } else {
        setIsBlocked(true);
        setTimeout(() => setIsBlocked(false), 2000);
      }
    }
  }, [busy, draggingType, imageUpload, fileUpload, fileSearch, onUploadFile]);
  const inputClassNames = css('mwai-input', {
    'mwai-dragging': draggingType,
    'mwai-blocked': isBlocked
  });
  return /*#__PURE__*/React.createElement(_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.TransitionBlock, {
    dir: "auto",
    id: `mwai-chatbot-${customId || botId}`,
    className: baseClasses,
    style: {
      ...cssVariables,
      ...style
    },
    if: true,
    disableTransition: !isWindow
  }, themeStyle && /*#__PURE__*/React.createElement("style", null, themeStyle), /*#__PURE__*/React.createElement(_ChatbotTrigger__WEBPACK_IMPORTED_MODULE_3__["default"], null), /*#__PURE__*/React.createElement(_ChatbotHeader__WEBPACK_IMPORTED_MODULE_4__["default"], null), /*#__PURE__*/React.createElement("div", {
    className: "mwai-content"
  }, !isRealtime && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: conversationRef,
    className: "mwai-conversation",
    onScroll: onScroll
  }, messageList, jsxShortcuts), error && /*#__PURE__*/React.createElement("div", {
    className: "mwai-error",
    onClick: () => resetError()
  }, /*#__PURE__*/React.createElement(markdown_to_jsx__WEBPACK_IMPORTED_MODULE_5__["default"], {
    options: markdownOptions
  }, error)), jsxBlocks, /*#__PURE__*/React.createElement("div", {
    className: inputClassNames,
    onClick: () => {
      var _chatbotInputRef$curr;
      return (_chatbotInputRef$curr = chatbotInputRef.current) === null || _chatbotInputRef$curr === void 0 ? void 0 : _chatbotInputRef$curr.focusInput();
    },
    onDrop: handleDrop,
    onDragEnter: event => handleDrag(event, true),
    onDragLeave: event => handleDrag(event, false),
    onDragOver: event => handleDrag(event, true)
  }, /*#__PURE__*/React.createElement(_ChatbotInput__WEBPACK_IMPORTED_MODULE_6__["default"], null), /*#__PURE__*/React.createElement(_ChatbotSubmit__WEBPACK_IMPORTED_MODULE_7__["default"], null))), isRealtime && /*#__PURE__*/React.createElement("div", {
    className: "mwai-realtime"
  }, /*#__PURE__*/React.createElement(_ChatbotRealtime__WEBPACK_IMPORTED_MODULE_8__["default"], null)), needsFooter && /*#__PURE__*/React.createElement("div", {
    className: "mwai-footer"
  }, needTools && /*#__PURE__*/React.createElement("div", {
    className: "mwai-tools"
  }, uploadIconPosition === 'mwai-tools' && /*#__PURE__*/React.createElement(_ChatUploadIcon__WEBPACK_IMPORTED_MODULE_9__["default"], null)), textCompliance && /*#__PURE__*/React.createElement("div", {
    className: "mwai-compliance",
    dangerouslySetInnerHTML: {
      __html: textCompliance
    }
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ChatbotUI);

/***/ }),

/***/ "./app/js/chatbot/DiscussionsContext.js":
/*!**********************************************!*\
  !*** ./app/js/chatbot/DiscussionsContext.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DiscussionsContextProvider: () => (/* binding */ DiscussionsContextProvider),
/* harmony export */   useDiscussionsContext: () => (/* binding */ useDiscussionsContext)
/* harmony export */ });
/* harmony import */ var _app_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/helpers */ "./app/js/helpers.js");
// Previous: 2.7.7
// Current: 2.8.2

// React & Vendor Libs
const {
  useContext,
  createContext,
  useState,
  useMemo,
  useEffect,
  useCallback
} = wp.element;

const DiscussionsContext = createContext();
const useDiscussionsContext = () => {
  const context = useContext(DiscussionsContext);
  if (!context) {
    throw new Error('useDiscussionsContext must be used within a DiscussionsContextProvider');
  }
  return context;
};
const DiscussionsContextProvider = ({
  children,
  ...rest
}) => {
  const {
    system,
    theme
  } = rest;
  const [discussions, setDiscussions] = useState([]);
  const [discussion, setDiscussion] = useState(null);
  const [busy, setBusy] = useState(false);
  const shortcodeStyles = useMemo(() => (theme === null || theme === void 0 ? void 0 : theme.settings) || {}, [theme]);

  // System Parameters
  const botId = system.botId;
  const customId = system.customId;
  const restNonce = system.restNonce;
  const pluginUrl = system.pluginUrl;
  const restUrl = system.restUrl;
  const debugMode = system.debugMode;

  // UI Parameters
  const cssVariables = useMemo(() => {
    const cssVariables = Object.keys(shortcodeStyles).reduce((acc, key) => {
      acc[`--mwai-${key}`] = shortcodeStyles[key];
      return acc;
    }, {});
    return cssVariables;
  }, [shortcodeStyles]);
  const hasEmptyDiscussion = useMemo(() => {
    return discussions.some(discussion => discussion.messages.length === 0);
  }, [discussions]);
  const refresh = useCallback(async (silentRefresh = false) => {
    try {
      if (!silentRefresh) {
        setBusy(true);
      }
      const body = {
        botId: botId || customId
      };
      if (debugMode) {
        console.log('[DISCUSSIONS] OUT: ', body);
      }
      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce
        },
        body: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__.nekoStringify)(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not retrieve the discussions: ${data.message}`);
      }
      if (debugMode) {
        console.log('[DISCUSSIONS] IN: ', data);
      }
      const conversations = data.chats.map(conversation => {
        const messages = JSON.parse(conversation.messages);
        const extra = JSON.parse(conversation.extra);
        return {
          ...conversation,
          messages,
          extra
        };
      });

      // Merge server conversations with local discussions
      setDiscussions(prevDiscussions => {
        const discussionMap = new Map();

        // Add local discussions to the map
        prevDiscussions.forEach(disc => {
          discussionMap.set(disc.chatId, disc);
        });

        // Update or add server discussions
        conversations.forEach(serverDisc => {
          discussionMap.set(serverDisc.chatId, serverDisc);
        });
        const newDiscussions = Array.from(discussionMap.values());

        // Update the selected discussion if necessary
        if (discussion) {
          const updatedDiscussion = newDiscussions.find(disc => disc.chatId === discussion.chatId);
          if (updatedDiscussion && updatedDiscussion !== discussion) {
            setDiscussion(updatedDiscussion);
          }
        }
        return newDiscussions;
      });
    } catch (err) {
      console.error(err);
    } finally {
      if (!silentRefresh) {
        setBusy(false);
      }
    }
  }, [discussion]);
  const refreshInterval = (system === null || system === void 0 ? void 0 : system.refreshInterval) || 5000;
  useEffect(() => {
    refresh();
    const interval = setInterval(() => {
      refresh(true);
    }, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshInterval]);
  useEffect(() => {
    if (discussion) {
      const updatedDiscussion = discussions.find(disc => disc.chatId === discussion.chatId);
      if (updatedDiscussion && updatedDiscussion !== discussion) {
        setDiscussion(updatedDiscussion);
      }
    }
  }, [discussions]);
  const getChatbot = botId => {
    const chatbot = MwaiAPI.getChatbot(botId);
    if (!chatbot) {
      throw new Error(`Chatbot not found.`, {
        botId,
        chatbots: MwaiAPI.chatbots
      });
    }
    return chatbot;
  };
  const onDiscussionClick = async chatId => {
    const selectedDiscussion = discussions.find(x => x.chatId === chatId);
    if (!selectedDiscussion) {
      console.error(`Discussion not found.`, {
        chatId,
        discussions
      });
      return;
    }

    // Remove empty discussions that are not the selected one
    setDiscussions(prevDiscussions => prevDiscussions.filter(disc => disc.messages.length > 0 || disc.chatId === chatId));
    const chatbot = getChatbot(botId);
    chatbot.setContext({
      chatId,
      messages: selectedDiscussion.messages
    });
    setDiscussion(selectedDiscussion);
  };
  const onEditDiscussion = async discussionToEdit => {
    const newTitle = prompt('Enter a new title for the discussion:', discussionToEdit.title || '');
    if (newTitle === null) {
      // User cancelled the prompt
      return;
    }
    const trimmedTitle = newTitle.trim();
    if (trimmedTitle === '') {
      alert('Title cannot be empty.');
      return;
    }
    try {
      setBusy(true);
      const body = {
        chatId: discussionToEdit.chatId,
        title: trimmedTitle
      };
      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/edit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce
        },
        body: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__.nekoStringify)(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not update the discussion: ${data.message}`);
      }

      // Update the discussions state
      setDiscussions(prevDiscussions => prevDiscussions.map(disc => disc.chatId === discussionToEdit.chatId ? {
        ...disc,
        title: trimmedTitle
      } : disc));
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating the discussion.');
    } finally {
      setBusy(false);
    }
  };
  const onDeleteDiscussion = async discussionToDelete => {
    const confirmed = confirm('Are you sure you want to delete this discussion?');
    if (!confirmed) {
      return;
    }
    try {
      setBusy(true);
      const body = {
        chatIds: [discussionToDelete.chatId]
      };
      const response = await fetch(`${restUrl}/mwai-ui/v1/discussions/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-WP-Nonce': restNonce
        },
        body: (0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__.nekoStringify)(body)
      });
      const data = await response.json();
      if (!data.success) {
        throw new Error(`Could not delete the discussion: ${data.message}`);
      }

      // Update the discussions state
      setDiscussions(prevDiscussions => prevDiscussions.filter(disc => disc.chatId !== discussionToDelete.chatId));

      // If the deleted discussion was selected, deselect it
      if ((discussion === null || discussion === void 0 ? void 0 : discussion.chatId) === discussionToDelete.chatId) {
        setDiscussion(null);
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while deleting the discussion.');
    } finally {
      setBusy(false);
    }
  };
  const onNewChatClick = async () => {
    const existingEmptyDiscussion = discussions.find(disc => disc.messages.length === 0);
    if (existingEmptyDiscussion) {
      setDiscussion(existingEmptyDiscussion);
      return;
    }
    const chatbot = getChatbot(botId);
    const newChatId = (0,_app_helpers__WEBPACK_IMPORTED_MODULE_0__.randomStr)();
    chatbot.clear({
      chatId: newChatId
    });
    const newDiscussion = {
      id: newChatId,
      chatId: newChatId,
      messages: [],
      title: 'New Chat',
      extra: {}
    };
    setDiscussion(newDiscussion);
    setDiscussions(prevDiscussions => [newDiscussion, ...prevDiscussions]);
  };
  const actions = {
    onDiscussionClick,
    onNewChatClick,
    onEditDiscussion,
    onDeleteDiscussion
  };
  const state = {
    botId,
    pluginUrl,
    busy,
    setBusy,
    cssVariables,
    discussions,
    discussion,
    theme,
    hasEmptyDiscussion
  };
  return /*#__PURE__*/React.createElement(DiscussionsContext.Provider, {
    value: {
      state,
      actions
    }
  }, children);
};

/***/ }),

/***/ "./app/js/chatbot/DiscussionsSystem.js":
/*!*********************************************!*\
  !*** ./app/js/chatbot/DiscussionsSystem.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app_chatbot_DiscussionsContext__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/DiscussionsContext */ "./app/js/chatbot/DiscussionsContext.js");
/* harmony import */ var _app_chatbot_DiscussionsUI__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/chatbot/DiscussionsUI */ "./app/js/chatbot/DiscussionsUI.js");
// Previous: 1.6.81
// Current: 2.4.5



const DiscussionsSystem = props => {
  return /*#__PURE__*/React.createElement(_app_chatbot_DiscussionsContext__WEBPACK_IMPORTED_MODULE_0__.DiscussionsContextProvider, props, /*#__PURE__*/React.createElement(_app_chatbot_DiscussionsUI__WEBPACK_IMPORTED_MODULE_1__["default"], props));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DiscussionsSystem);

/***/ }),

/***/ "./app/js/chatbot/DiscussionsUI.js":
/*!*****************************************!*\
  !*** ./app/js/chatbot/DiscussionsUI.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/pencil.js");
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/trash.js");
/* harmony import */ var _app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/helpers */ "./app/js/chatbot/helpers.js");
/* harmony import */ var _app_chatbot_DiscussionsContext__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @app/chatbot/DiscussionsContext */ "./app/js/chatbot/DiscussionsContext.js");
// Previous: 2.6.5
// Current: 2.7.7

const {
  useMemo,
  useEffect,
  useState,
  useCallback
} = wp.element;



const Discussion = ({
  discussion,
  onClick = () => {},
  selected = false,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  const css = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useClasses)();
  const [hovered, setHovered] = useState(false);
  const messages = discussion.messages;
  const message = messages[messages.length - 1];
  const preview = useMemo(() => {
    if (discussion.title) {
      return discussion.title;
    }
    const messageText = (message === null || message === void 0 ? void 0 : message.content.length) > 64 ? message.content.substring(0, 64) + '...' : message.content;
    return messageText || 'No messages yet';
  }, [discussion, message]);
  const baseClasses = css('mwai-discussion', {
    'mwai-active': selected
  });
  const onDeleteClick = useCallback(e => {
    e.stopPropagation();
    onDelete(discussion);
  }, [discussion, onDelete]);
  const onEditClick = useCallback(e => {
    e.stopPropagation();
    onEdit(discussion);
  }, [discussion, onEdit]);
  return /*#__PURE__*/React.createElement("li", {
    className: baseClasses,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, /*#__PURE__*/React.createElement("span", {
    className: css('mwai-discussion-title')
  }, preview), hovered && /*#__PURE__*/React.createElement("div", {
    className: css('mwai-discussion-actions')
  }, /*#__PURE__*/React.createElement("div", {
    className: css('mwai-icon'),
    onClick: onEditClick
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_1__["default"], {
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: css(['mwai-icon', 'mwai-danger']),
    onClick: onDeleteClick
  }, /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_2__["default"], {
    size: 18
  }))));
};
const DiscussionsUI = props => {
  const {
    theme,
    style,
    params
  } = props;
  const css = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useClasses)();
  const themeStyle = useMemo(() => (theme === null || theme === void 0 ? void 0 : theme.type) === 'css' ? theme === null || theme === void 0 ? void 0 : theme.style : null, [theme]);
  const {
    state,
    actions
  } = (0,_app_chatbot_DiscussionsContext__WEBPACK_IMPORTED_MODULE_3__.useDiscussionsContext)();
  const {
    botId,
    cssVariables,
    discussions,
    discussion,
    busy,
    hasEmptyDiscussion
  } = state;
  const {
    onDiscussionClick,
    onNewChatClick,
    onEditDiscussion,
    onDeleteDiscussion
  } = actions;
  const {
    textNewChat
  } = params;
  const open = useState(false);
  useEffect(() => {
    // Prepare the API
    // mwaiAPI.open = () => setOpen(true);
    // mwaiAPI.close = () => setOpen(false);
    // mwaiAPI.toggle = () => setOpen(!open);
  }, []);
  const baseClasses = css('mwai-discussions', {
    [`mwai-${theme === null || theme === void 0 ? void 0 : theme.themeId}-theme`]: true
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    id: `mwai-discussions-${botId}`,
    className: baseClasses,
    style: {
      ...cssVariables,
      ...style
    }
  }, themeStyle && /*#__PURE__*/React.createElement("style", null, themeStyle), /*#__PURE__*/React.createElement("div", {
    className: css('mwai-header')
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => onNewChatClick(),
    disabled: busy || hasEmptyDiscussion
  }, /*#__PURE__*/React.createElement("span", null, textNewChat ?? '+ New chat'))), /*#__PURE__*/React.createElement("ul", {
    className: css('mwai-content')
  }, discussions.map(x => /*#__PURE__*/React.createElement(Discussion, {
    key: x.id,
    discussion: x,
    selected: (discussion === null || discussion === void 0 ? void 0 : discussion.id) === x.id,
    onClick: () => onDiscussionClick(x.chatId),
    onEdit: onEditDiscussion,
    onDelete: onDeleteDiscussion
  })))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DiscussionsUI);

/***/ }),

/***/ "./app/js/chatbot/MwaiAPI.js":
/*!***********************************!*\
  !*** ./app/js/chatbot/MwaiAPI.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addAction: () => (/* binding */ addAction),
/* harmony export */   addFilter: () => (/* binding */ addFilter),
/* harmony export */   applyFilters: () => (/* binding */ applyFilters),
/* harmony export */   doAction: () => (/* binding */ doAction),
/* harmony export */   mwaiAPI: () => (/* binding */ mwaiAPI)
/* harmony export */ });
// Previous: 2.4.9
// Current: 2.7.4

class MwaiAPI {
  constructor() {
    if (typeof window !== 'undefined' && window.MwaiAPI) {
      return window.MwaiAPI;
    }
    this.chatbots = [];
    this.forms = [];
    this.filters = {};
    this.actions = {};
    if (typeof window !== 'undefined') {
      window.MwaiAPI = this;
    }
  }
  getChatbot(botId = null) {
    if (!botId) {
      return this.chatbots[0];
    }
    return this.chatbots.find(x => x.botId === botId || x.customId === botId);
  }
  getForm(formId = null) {
    if (!formId) {
      return this.forms[0];
    }
    return this.forms.find(f => f.formId === formId);
  }
  addFilter(tag, callback, priority = 10) {
    if (!this.filters[tag]) {
      this.filters[tag] = [];
    }
    this.filters[tag].push({
      callback,
      priority
    });
    this.filters[tag].sort((a, b) => a.priority - b.priority);
  }
  applyFilters(tag, value, ...args) {
    if (!this.filters[tag]) {
      return value;
    }
    return this.filters[tag].reduce((acc, filter) => {
      return filter.callback(acc, ...args);
    }, value);
  }
  addAction(tag, callback, priority = 10) {
    if (!this.actions[tag]) {
      this.actions[tag] = [];
    }
    this.actions[tag].push({
      callback,
      priority
    });
    this.actions[tag].sort((a, b) => a.priority - b.priority);
  }
  doAction(tag, ...args) {
    if (!this.actions[tag]) {
      return;
    }
    this.actions[tag].forEach(action => {
      action.callback(...args);
    });
  }
}

// Ensure the class is only initialized once
const getInstance = () => {
  if (typeof window !== 'undefined' && window.MwaiAPI) {
    return window.MwaiAPI;
  }
  const instance = new MwaiAPI();
  if (typeof window !== 'undefined') {
    window.MwaiAPI = instance;
  }
  return instance;
};
const mwaiAPI = getInstance();
const addFilter = (tag, callback, priority = 10) => {
  mwaiAPI.addFilter(tag, callback, priority);
};
const applyFilters = (tag, value, ...args) => {
  return mwaiAPI.applyFilters(tag, value, ...args);
};
const addAction = (tag, callback, priority = 10) => {
  mwaiAPI.addAction(tag, callback, priority);
};
const doAction = (tag, ...args) => {
  mwaiAPI.doAction(tag, ...args);
};


/***/ }),

/***/ "./app/js/chatbot/helpers.js":
/*!***********************************!*\
  !*** ./app/js/chatbot/helpers.js ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Microphone: () => (/* binding */ Microphone),
/* harmony export */   TransitionBlock: () => (/* binding */ TransitionBlock),
/* harmony export */   doPlaceholders: () => (/* binding */ doPlaceholders),
/* harmony export */   isURL: () => (/* binding */ isURL),
/* harmony export */   processParameters: () => (/* binding */ processParameters),
/* harmony export */   useChrono: () => (/* binding */ useChrono),
/* harmony export */   useClasses: () => (/* binding */ useClasses),
/* harmony export */   useInterval: () => (/* binding */ useInterval),
/* harmony export */   useSpeechRecognition: () => (/* binding */ useSpeechRecognition),
/* harmony export */   useViewport: () => (/* binding */ useViewport)
/* harmony export */ });
/* harmony import */ var lucide_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! lucide-react */ "./node_modules/lucide-react/dist/esm/icons/mic.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Previous: 2.6.9
// Current: 2.7.0

const {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback
} = wp.element;

const Microphone = ({
  active,
  disabled,
  ...rest
}) => {
  return (
    /*#__PURE__*/
    // eslint-disable-next-line react/no-unknown-property
    React.createElement("div", _extends({
      active: active ? "true" : "false",
      disabled: disabled
    }, rest), /*#__PURE__*/React.createElement(lucide_react__WEBPACK_IMPORTED_MODULE_0__["default"], {
      size: "24"
    }))
  );
};
function useInterval(delay, callback, enabled = true) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null && enabled) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay, enabled]);
}
const useClasses = () => {
  return useMemo(() => {
    return (classNames, conditionalClasses) => {
      if (!Array.isArray(classNames)) {
        classNames = [classNames];
      }
      if (conditionalClasses) {
        Object.entries(conditionalClasses).forEach(([className, condition]) => {
          if (condition) {
            classNames.push(className);
          }
        });
      }
      return classNames.join(' ');
    };
  }, []);
};
function isURL(url) {
  if (!url || typeof url !== 'string') return false;
  return url.indexOf('http') === 0;
}
function useChrono() {
  const [timeElapsed, setTimeElapsed] = useState(null);
  const intervalIdRef = useRef(null);
  function startChrono() {
    if (intervalIdRef.current !== null) return;
    const startTime = Date.now();
    intervalIdRef.current = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setTimeElapsed(formatTime(elapsedSeconds));
    }, 500);
  }
  function stopChrono() {
    clearInterval(intervalIdRef.current);
    intervalIdRef.current = null;
    setTimeElapsed(null);
  }
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  useEffect(() => {
    return () => {
      clearInterval(intervalIdRef.current);
    };
  }, []);
  return {
    timeElapsed,
    startChrono,
    stopChrono
  };
}
const doPlaceholders = (text, placeholders) => {
  if (typeof text !== 'string' || !placeholders) {
    return text;
  }
  Object.entries(placeholders).forEach(([key, value]) => {
    text = text.replace(new RegExp(`{${key}}`, 'g'), value);
  });
  return text;
};
const processParameters = (params, placeholders = []) => {
  var _params$guestName, _params$textSend, _params$textClear, _params$textInputPlac, _params$textComplianc, _params$icon, _params$iconText, _params$iconAlt, _params$iconPosition, _params$aiName, _params$userName, _params$aiAvatarUrl, _params$userAvatarUrl, _params$guestAvatarUr, _params$mode;
  const guestName = ((_params$guestName = params.guestName) === null || _params$guestName === void 0 ? void 0 : _params$guestName.trim()) ?? "";
  const textSend = ((_params$textSend = params.textSend) === null || _params$textSend === void 0 ? void 0 : _params$textSend.trim()) ?? "";
  const textClear = ((_params$textClear = params.textClear) === null || _params$textClear === void 0 ? void 0 : _params$textClear.trim()) ?? "";
  const textInputMaxLength = parseInt(params.textInputMaxLength);
  const textInputPlaceholder = ((_params$textInputPlac = params.textInputPlaceholder) === null || _params$textInputPlac === void 0 ? void 0 : _params$textInputPlac.trim()) ?? "";
  let textCompliance = ((_params$textComplianc = params.textCompliance) === null || _params$textComplianc === void 0 ? void 0 : _params$textComplianc.trim()) ?? "";
  let headerSubtitle = "";
  const window = Boolean(params.window);
  const copyButton = Boolean(params.copyButton);
  const fullscreen = Boolean(params.fullscreen);
  const icon = ((_params$icon = params.icon) === null || _params$icon === void 0 ? void 0 : _params$icon.trim()) ?? "";
  let iconText = ((_params$iconText = params.iconText) === null || _params$iconText === void 0 ? void 0 : _params$iconText.trim()) ?? "";
  const iconTextDelay = parseInt(params.iconTextDelay || 1);
  const iconAlt = ((_params$iconAlt = params.iconAlt) === null || _params$iconAlt === void 0 ? void 0 : _params$iconAlt.trim()) ?? "";
  const iconPosition = ((_params$iconPosition = params.iconPosition) === null || _params$iconPosition === void 0 ? void 0 : _params$iconPosition.trim()) ?? "";
  const iconBubble = Boolean(params.iconBubble);
  const aiName = ((_params$aiName = params.aiName) === null || _params$aiName === void 0 ? void 0 : _params$aiName.trim()) ?? "";
  const userName = ((_params$userName = params.userName) === null || _params$userName === void 0 ? void 0 : _params$userName.trim()) ?? "";
  const aiAvatar = Boolean(params === null || params === void 0 ? void 0 : params.aiAvatar);
  const userAvatar = Boolean(params === null || params === void 0 ? void 0 : params.userAvatar);
  const guestAvatar = Boolean(params === null || params === void 0 ? void 0 : params.guestAvatar);
  const aiAvatarUrl = aiAvatar ? (params === null || params === void 0 || (_params$aiAvatarUrl = params.aiAvatarUrl) === null || _params$aiAvatarUrl === void 0 ? void 0 : _params$aiAvatarUrl.trim()) ?? "" : null;
  const userAvatarUrl = userAvatar ? (params === null || params === void 0 || (_params$userAvatarUrl = params.userAvatarUrl) === null || _params$userAvatarUrl === void 0 ? void 0 : _params$userAvatarUrl.trim()) ?? "" : null;
  const guestAvatarUrl = guestAvatar ? (params === null || params === void 0 || (_params$guestAvatarUr = params.guestAvatarUrl) === null || _params$guestAvatarUr === void 0 ? void 0 : _params$guestAvatarUr.trim()) ?? "" : null;
  const localMemory = Boolean(params.localMemory);
  const imageUpload = Boolean(params.imageUpload);
  const fileUpload = Boolean(params.fileUpload);
  const fileSearch = Boolean(params.fileSearch);
  const mode = ((_params$mode = params.mode) === null || _params$mode === void 0 ? void 0 : _params$mode.trim()) ?? "chat";
  if (params.headerSubtitle === null || params.headerSubtitle === undefined) {
    headerSubtitle = "Discuss with";
  } else {
    var _params$headerSubtitl;
    headerSubtitle = ((_params$headerSubtitl = params.headerSubtitle) === null || _params$headerSubtitl === void 0 ? void 0 : _params$headerSubtitl.trim()) ?? "";
  }
  if (placeholders) {
    textCompliance = doPlaceholders(textCompliance, placeholders);
    iconText = doPlaceholders(iconText, placeholders);
  }
  return {
    textSend,
    textClear,
    textInputMaxLength,
    textInputPlaceholder,
    textCompliance,
    mode,
    window,
    copyButton,
    fullscreen,
    localMemory,
    imageUpload,
    fileUpload,
    fileSearch,
    icon,
    iconText,
    iconTextDelay,
    iconAlt,
    iconPosition,
    iconBubble,
    headerSubtitle,
    aiName,
    userName,
    guestName,
    aiAvatar,
    userAvatar,
    guestAvatar,
    aiAvatarUrl,
    userAvatarUrl,
    guestAvatarUrl
  };
};
const isAndroid = () => {
  return navigator.userAgent.toLowerCase().indexOf("android") > -1;
};
const useSpeechRecognition = onResult => {
  const [isListening, setIsListening] = useState(false);
  const [speechRecognitionAvailable, setSpeechRecognitionAvailable] = useState(false);
  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      setSpeechRecognitionAvailable(true);
    }
  }, []);
  useEffect(() => {
    if (!speechRecognitionAvailable) {
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    let handleResult = null;
    if (!isAndroid()) {
      recognition.interimResults = true;
      recognition.continuous = true;
      handleResult = event => {
        const transcript = Array.from(event.results).map(result => result[0]).map(result => result.transcript).join('');
        onResult(transcript);
      };
    } else {
      recognition.interimResults = false;
      recognition.continuous = false;
      handleResult = event => {
        const finalTranscript = Array.from(event.results).filter(result => result.isFinal).map(result => result[0].transcript).join('');
        onResult(finalTranscript);
        setIsListening(false);
      };
    }
    if (isListening) {
      recognition.addEventListener('result', handleResult);
      recognition.start();
    } else {
      recognition.removeEventListener('result', handleResult);
      recognition.abort();
    }
    return () => {
      recognition.abort();
    };
  }, [isListening, speechRecognitionAvailable]);
  return {
    isListening,
    setIsListening,
    speechRecognitionAvailable
  };
};
const TransitionBlock = ({
  if: condition,
  className,
  disableTransition = false,
  children,
  ...rest
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [animationClass, setAnimationClass] = useState('mwai-transition');
  useEffect(() => {
    if (disableTransition) {
      setShouldRender(condition);
    } else {
      if (condition) {
        setShouldRender(true);
        setTimeout(() => {
          setAnimationClass('mwai-transition mwai-transition-visible');
        }, 150);
      } else {
        setAnimationClass('mwai-transition');
      }
    }
  }, [condition, disableTransition]);
  const handleTransitionEnd = () => {
    if (animationClass === 'mwai-transition' && !disableTransition) {
      setShouldRender(false);
    }
  };
  return !shouldRender ? null : /*#__PURE__*/React.createElement("div", _extends({
    className: `${className} ${disableTransition ? '' : animationClass}`,
    onTransitionEnd: handleTransitionEnd
  }, rest), children);
};
const useViewport = () => {
  const [viewportHeight, setViewportHeight] = useState(window.visualViewport.height);
  const isAndroid = useMemo(() => /Android/.test(navigator.userAgent), []);
  const isIOS = useMemo(() => /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream, []);
  const viewport = useRef(window.visualViewport);
  const handleResize = useCallback(() => {
    setViewportHeight(viewport.current.height);
  }, []);
  useEffect(() => {
    const currentViewport = viewport.current;
    currentViewport.addEventListener('resize', handleResize);
    if (isIOS) {
      window.addEventListener('resize', handleResize);
      document.addEventListener('focusin', handleResize);
    } else {
      currentViewport.addEventListener('scroll', handleResize);
    }
    return () => {
      currentViewport.removeEventListener('resize', handleResize);
      if (isIOS) {
        window.removeEventListener('resize', handleResize);
        document.removeEventListener('focusin', handleResize);
      } else {
        currentViewport.removeEventListener('scroll', handleResize);
      }
    };
  }, [handleResize, isIOS]);
  return {
    viewportHeight,
    isIOS,
    isAndroid
  };
};


/***/ }),

/***/ "./app/js/components/ReplyActions.js":
/*!*******************************************!*\
  !*** ./app/js/components/ReplyActions.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/helpers */ "./app/js/chatbot/helpers.js");
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Previous: 2.5.0
// Current: 2.5.3


const {
  useState,
  useEffect,
  useRef,
  useCallback
} = wp.element;
const svgPathDefault = '<path d="M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z" />';
const svgPathSuccess = '<path d="M10.7673 18C10.3106 18 9.86749 17.8046 9.54432 17.4555L5.50694 13.1222C4.83102 12.3968 4.83102 11.2208 5.50694 10.4954C6.18287 9.76997 7.27871 9.76997 7.95505 10.4954L10.6794 13.4196L16.9621 5.63976C17.5874 4.86495 18.6832 4.78289 19.4031 5.45388C20.125 6.12487 20.2036 7.29638 19.5759 8.07391L12.0778 17.3589C11.7639 17.7475 11.3119 17.9801 10.8319 18C10.8087 18 10.788 18 10.7673 18Z" />';
const svgPathError = '<path d="M17.7623 17.7626C17.0831 18.4418 15.9549 18.416 15.244 17.705L5.79906 8.26012C5.08811 7.54917 5.0623 6.42098 5.74145 5.74183C6.4206 5.06267 7.54879 5.08849 8.25975 5.79944L17.7047 15.2443C18.4156 15.9553 18.4414 17.0835 17.7623 17.7626Z" /><path d="M17.5508 8.52848L8.52842 17.5509C7.84927 18.23 6.72108 18.2042 6.01012 17.4933C5.29917 16.7823 5.27336 15.6541 5.95251 14.975L14.9749 5.95257C15.6541 5.27342 16.7823 5.29923 17.4932 6.01019C18.2042 6.72114 18.23 7.84933 17.5508 8.52848Z" />';
const ReplyActions = ({
  enabled,
  content,
  children,
  className,
  ...rest
}) => {
  const css = (0,_app_chatbot_helpers__WEBPACK_IMPORTED_MODULE_0__.useClasses)();
  const [copyStatus, setCopyStatus] = useState('idle');
  const [hidden, setHidden] = useState(true);
  const timeoutRef = useRef(null);
  const hasEnteredRef = useRef(false);
  const onCopy = () => {
    try {
      navigator.clipboard.writeText(content);
      setCopyStatus('success');
    } catch (err) {
      setCopyStatus('error');
      console.warn('Not allowed to copy to clipboard. Make sure your website uses HTTPS.', {
        content
      });
    } finally {
      setTimeout(() => {
        setCopyStatus('idle');
      }, 2000);
    }
  };
  const handleMouseEnter = useCallback(() => {
    if (!hasEnteredRef.current) {
      hasEnteredRef.current = true;
      timeoutRef.current = setTimeout(() => {
        setHidden(false);
      }, 500);
    }
  }, []);
  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setHidden(true);
    hasEnteredRef.current = false;
  }, []);
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  const svgPath = copyStatus === 'success' ? svgPathSuccess : copyStatus === 'error' ? svgPathError : svgPathDefault;
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    onMouseOver: handleMouseEnter
  }), /*#__PURE__*/React.createElement("span", {
    className: className
  }, children), /*#__PURE__*/React.createElement("div", {
    className: css('mwai-reply-actions', {
      'mwai-hidden': hidden
    })
  }, enabled && /*#__PURE__*/React.createElement("div", {
    className: "mwai-copy-button",
    onClick: onCopy
  }, /*#__PURE__*/React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    dangerouslySetInnerHTML: {
      __html: svgPath
    }
  }))));
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ReplyActions);

/***/ }),

/***/ "./app/js/helpers.js":
/*!***************************!*\
  !*** ./app/js/helpers.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BlinkingCursor: () => (/* binding */ BlinkingCursor),
/* harmony export */   OutputHandler: () => (/* binding */ OutputHandler),
/* harmony export */   isEmoji: () => (/* binding */ isEmoji),
/* harmony export */   mwaiFetch: () => (/* binding */ mwaiFetch),
/* harmony export */   mwaiFetchUpload: () => (/* binding */ mwaiFetchUpload),
/* harmony export */   mwaiHandleRes: () => (/* binding */ mwaiHandleRes),
/* harmony export */   nekoStringify: () => (/* binding */ nekoStringify),
/* harmony export */   randomStr: () => (/* binding */ randomStr)
/* harmony export */ });
/* harmony import */ var markdown_to_jsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! markdown-to-jsx */ "./node_modules/markdown-to-jsx/dist/index.modern.js");
// Previous: 2.7.7
// Current: 2.8.2

const {
  useMemo,
  useEffect,
  useState
} = wp.element;

function nekoStringify(obj, space = null, ignoreCircular = true) {
  const cache = [];
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (cache.includes(value)) {
        if (!ignoreCircular) {
          console.warn('Circular reference found.', {
            key,
            value,
            cache,
            cacheIndex: cache.indexOf(value)
          });
          throw new Error('Circular reference found. Cancelled.');
        }
        return;
      }
      cache.push(value);
    }
    return value;
  }, space);
}
async function mwaiHandleRes(fetchRes, onStream, debugName = null) {
  if (!onStream) {
    try {
      const data = await fetchRes.json();
      if (debugName) {
        console.log(`[${debugName}] IN: `, data);
      }
      return data;
    } catch (err) {
      console.error("Could not parse the regular response.", {
        err
      });
      return {
        success: false,
        message: "Could not parse the regular response."
      };
    }
  }
  const reader = fetchRes.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  let decodedContent = '';
  while (true) {
    const {
      value,
      done
    } = await reader.read();
    buffer += decoder.decode(value, {
      stream: true
    });
    if (done) break;
    const lines = buffer.split('\n');
    for (let i = 0; i < lines.length - 1; i++) {
      if (lines[i].indexOf('data: ') !== 0) {
        continue;
      }
      let data;
      try {
        data = JSON.parse(lines[i].replace('data: ', ''));
      } catch (err) {
        console.error("Failed to parse stream line.", {
          line: lines[i],
          err
        });
        continue; // skip malformed lines
      }
      if (data['type'] === 'live') {
        if (debugName) {
          console.log(`[${debugName} STREAM] LIVE: `, data);
        }
        decodedContent += data.data;
        onStream && onStream(decodedContent, data.data);
      } else if (data['type'] === 'error') {
        try {
          if (debugName) {
            console.error(`[${debugName} STREAM] ERROR: `, data.data);
          }
          return {
            success: false,
            message: data.data
          };
        } catch (err) {
          console.error("Could not parse the 'error' stream.", {
            err,
            data
          });
          return {
            success: false,
            message: "Could not parse the 'error' stream."
          };
        }
      } else if (data['type'] === 'end') {
        try {
          const finalData = JSON.parse(data.data);
          if (debugName) {
            console.log(`[${debugName} STREAM] END: `, finalData);
          }
          return finalData;
        } catch (err) {
          console.error("Could not parse the 'end' stream.", {
            err,
            data
          });
          return {
            success: false,
            message: "Could not parse the 'end' stream."
          };
        }
      }
    }
    buffer = lines[lines.length - 1];
  }
  try {
    const finalData = JSON.parse(buffer);
    if (debugName) {
      console.log(`[${debugName} STREAM] IN: `, finalData);
    }
    return finalData;
  } catch (err) {
    console.error("Could not parse the buffer.", {
      err,
      buffer
    });
    return {
      success: false,
      message: "Could not parse the buffer."
    };
  }
}
async function mwaiFetch(url, body, restNonce, isStream, signal = undefined) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (restNonce) {
    headers['X-WP-Nonce'] = restNonce;
  }
  if (isStream) {
    headers['Accept'] = 'text/event-stream';
  }
  return await fetch(`${url}`, {
    method: 'POST',
    headers,
    body: nekoStringify(body),
    signal
  });
}
async function mwaiFetchUpload(url, file, restNonce, onProgress, params = {}) {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    for (const [key, value] of Object.entries(params)) {
      formData.append(key, value);
    }
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    if (restNonce) {
      xhr.setRequestHeader('X-WP-Nonce', restNonce);
    }
    xhr.upload.onprogress = function (event) {
      if (event.lengthComputable && onProgress) {
        const percentComplete = (event.loaded / event.total * 100).toFixed(2);
        onProgress && onProgress(percentComplete);
      }
    };
    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const jsonResponse = JSON.parse(xhr.responseText);
          resolve(jsonResponse);
        } catch (error) {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      } else {
        try {
          const jsonResponse = JSON.parse(xhr.responseText);
          reject({
            status: xhr.status,
            message: jsonResponse.message
          });
        } catch (error) {
          reject({
            status: xhr.status,
            statusText: xhr.statusText
          });
        }
      }
    };
    xhr.onerror = function () {
      reject({
        status: xhr.status,
        statusText: xhr.statusText
      });
    };
    xhr.send(formData);
  });
}
function randomStr() {
  return Math.random().toString(36).substring(2);
}
const BlinkingCursor = () => {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const intervalId = setInterval(() => {
        setVisible(v => !v);
      }, 500);
      // bug: not clearing interval on unmount because intervalId isn't stored
    }, 200);
    return () => clearTimeout(timeoutId);
  }, []);
  const cursorStyle = {
    opacity: visible ? 1 : 0,
    width: '1px',
    height: '1em',
    borderLeft: '8px solid',
    marginLeft: '2px'
  };
  return /*#__PURE__*/React.createElement("span", {
    style: cursorStyle
  });
};
const OutputHandler = props => {
  const {
    content,
    error,
    isStreaming,
    baseClass = "mwai-output-handler"
  } = props;
  const isError = !!error;
  let data = (isError ? error : content) ?? "";
  const matches = (data.match(/```/g) || []).length;
  if (matches % 2 !== 0) {
    data += "\n```";
  } else if (isStreaming) {
    data += "<BlinkingCursor />";
  }
  const classes = useMemo(() => {
    const freshClasses = [baseClass];
    if (error) {
      freshClasses.push('mwai-error');
    }
    return freshClasses;
  }, [error]);
  const markdownOptions = useMemo(() => {
    const options = {
      wrapper: 'div',
      forceWrapper: true,
      overrides: {
        BlinkingCursor: {
          component: BlinkingCursor
        },
        a: {
          props: {
            target: "_blank"
          }
        }
      }
    };
    return options;
  }, []);
  return /*#__PURE__*/React.createElement(markdown_to_jsx__WEBPACK_IMPORTED_MODULE_0__["default"], {
    options: markdownOptions,
    className: classes.join(' '),
    children: data
  });
};
const emojiRegex = /([\u2700-\u27BF]|[\uE000-\uF8FF]|[\uD800-\uDFFF]|[\uFE00-\uFE0F]|[\u1F100-\u1F1FF]|[\u1F200-\u1F2FF]|[\u1F300-\u1F5FF]|[\u1F600-\u1F64F]|[\u1F680-\u1F6FF]|[\u1F700-\u1F77F]|[\u1F780-\u1F7FF]|[\u1F800-\u1F8FF]|[\u1F900-\u1F9FF]|[\u1FA00-\u1FA6F])/;
function isEmoji(str) {
  return str && str.length === 2 && emojiRegex.test(str);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _extends)
/* harmony export */ });
function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}


/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ _objectWithoutPropertiesLoose)
/* harmony export */ });
function _objectWithoutPropertiesLoose(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/Icon.js":
/*!****************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/Icon.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Icon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./defaultAttributes.js */ "./node_modules/lucide-react/dist/esm/defaultAttributes.js");
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const Icon = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({
    color = "currentColor",
    size = 24,
    strokeWidth = 2,
    absoluteStrokeWidth,
    className = "",
    children,
    iconNode,
    ...rest
  }, ref) => {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(
      "svg",
      {
        ref,
        ..._defaultAttributes_js__WEBPACK_IMPORTED_MODULE_1__["default"],
        width: size,
        height: size,
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? Number(strokeWidth) * 24 / Number(size) : strokeWidth,
        className: (0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)("lucide", className),
        ...rest
      },
      [
        ...iconNode.map(([tag, attrs]) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(tag, attrs)),
        ...Array.isArray(children) ? children : [children]
      ]
    );
  }
);


//# sourceMappingURL=Icon.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/createLucideIcon.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/createLucideIcon.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createLucideIcon)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shared/src/utils.js */ "./node_modules/lucide-react/dist/esm/shared/src/utils.js");
/* harmony import */ var _Icon_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Icon.js */ "./node_modules/lucide-react/dist/esm/Icon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */





const createLucideIcon = (iconName, iconNode) => {
  const Component = (0,react__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
    ({ className, ...props }, ref) => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_Icon_js__WEBPACK_IMPORTED_MODULE_1__["default"], {
      ref,
      iconNode,
      className: (0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.mergeClasses)(`lucide-${(0,_shared_src_utils_js__WEBPACK_IMPORTED_MODULE_2__.toKebabCase)(iconName)}`, className),
      ...props
    })
  );
  Component.displayName = `${iconName}`;
  return Component;
};


//# sourceMappingURL=createLucideIcon.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/defaultAttributes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/defaultAttributes.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ defaultAttributes)
/* harmony export */ });
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

var defaultAttributes = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round"
};


//# sourceMappingURL=defaultAttributes.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/bug.js":
/*!*********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/bug.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Bug)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Bug = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Bug", [
  ["path", { d: "m8 2 1.88 1.88", key: "fmnt4t" }],
  ["path", { d: "M14.12 3.88 16 2", key: "qol33r" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1", key: "d7y7pr" }],
  [
    "path",
    {
      d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6",
      key: "xs1cw7"
    }
  ],
  ["path", { d: "M12 20v-9", key: "1qisl0" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5", key: "32zzws" }],
  ["path", { d: "M6 13H2", key: "82j7cp" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4", key: "4p0ekp" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4", key: "18gb23" }],
  ["path", { d: "M22 13h-4", key: "1jl80f" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4", key: "k3fwyw" }]
]);


//# sourceMappingURL=bug.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/captions.js":
/*!**************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/captions.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Captions)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Captions = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Captions", [
  ["rect", { width: "18", height: "14", x: "3", y: "5", rx: "2", ry: "2", key: "12ruh7" }],
  ["path", { d: "M7 15h4M15 15h2M7 11h2M13 11h4", key: "1ueiar" }]
]);


//# sourceMappingURL=captions.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/eraser.js":
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/eraser.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Eraser)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Eraser = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Eraser", [
  [
    "path",
    {
      d: "m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21",
      key: "182aya"
    }
  ],
  ["path", { d: "M22 21H7", key: "t4ddhn" }],
  ["path", { d: "m5 11 9 9", key: "1mo9qw" }]
]);


//# sourceMappingURL=eraser.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/loader.js":
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/loader.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Loader)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Loader = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Loader", [
  ["path", { d: "M12 2v4", key: "3427ic" }],
  ["path", { d: "m16.2 7.8 2.9-2.9", key: "r700ao" }],
  ["path", { d: "M18 12h4", key: "wj9ykh" }],
  ["path", { d: "m16.2 16.2 2.9 2.9", key: "1bxg5t" }],
  ["path", { d: "M12 18v4", key: "jadmvz" }],
  ["path", { d: "m4.9 19.1 2.9-2.9", key: "bwix9q" }],
  ["path", { d: "M2 12h4", key: "j09sii" }],
  ["path", { d: "m4.9 4.9 2.9 2.9", key: "giyufr" }]
]);


//# sourceMappingURL=loader.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/mic.js":
/*!*********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/mic.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Mic)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Mic = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Mic", [
  ["path", { d: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z", key: "131961" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2", key: "1vc78b" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22", key: "x3vr5v" }]
]);


//# sourceMappingURL=mic.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/pause.js":
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/pause.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Pause)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Pause = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Pause", [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1", key: "zuxfzm" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1", key: "1okwgv" }]
]);


//# sourceMappingURL=pause.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/pencil.js":
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/pencil.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Pencil)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Pencil = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Pencil", [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
]);


//# sourceMappingURL=pencil.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/play.js":
/*!**********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/play.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Play)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Play = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Play", [
  ["polygon", { points: "6 3 20 12 6 21 6 3", key: "1oa8hb" }]
]);


//# sourceMappingURL=play.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/send.js":
/*!**********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/send.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Send)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Send = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Send", [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
]);


//# sourceMappingURL=send.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/square.js":
/*!************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/square.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Square)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Square = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Square", [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", key: "afitv7" }]
]);


//# sourceMappingURL=square.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/trash.js":
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/trash.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Trash)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Trash = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Trash", [
  ["path", { d: "M3 6h18", key: "d0wm0j" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6", key: "4alrt4" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2", key: "v07s0e" }]
]);


//# sourceMappingURL=trash.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/icons/users.js":
/*!***********************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/icons/users.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Users)
/* harmony export */ });
/* harmony import */ var _createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../createLucideIcon.js */ "./node_modules/lucide-react/dist/esm/createLucideIcon.js");
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */



const Users = (0,_createLucideIcon_js__WEBPACK_IMPORTED_MODULE_0__["default"])("Users", [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
  ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
  ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75", key: "1da9ce" }]
]);


//# sourceMappingURL=users.js.map


/***/ }),

/***/ "./node_modules/lucide-react/dist/esm/shared/src/utils.js":
/*!****************************************************************!*\
  !*** ./node_modules/lucide-react/dist/esm/shared/src/utils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeClasses: () => (/* binding */ mergeClasses),
/* harmony export */   toKebabCase: () => (/* binding */ toKebabCase)
/* harmony export */ });
/**
 * @license lucide-react v0.454.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */

const toKebabCase = (string) => string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const mergeClasses = (...classes) => classes.filter((className, index, array) => {
  return Boolean(className) && className.trim() !== "" && array.indexOf(className) === index;
}).join(" ").trim();


//# sourceMappingURL=utils.js.map


/***/ }),

/***/ "./node_modules/markdown-to-jsx/dist/index.modern.js":
/*!***********************************************************!*\
  !*** ./node_modules/markdown-to-jsx/dist/index.modern.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   RuleType: () => (/* binding */ r),
/* harmony export */   compiler: () => (/* binding */ Xe),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   sanitizer: () => (/* binding */ He),
/* harmony export */   slugify: () => (/* binding */ Le)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
function t(){return t=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},t.apply(this,arguments)}const n=["children","options"],r={blockQuote:"0",breakLine:"1",breakThematic:"2",codeBlock:"3",codeFenced:"4",codeInline:"5",footnote:"6",footnoteReference:"7",gfmTask:"8",heading:"9",headingSetext:"10",htmlBlock:"11",htmlComment:"12",htmlSelfClosing:"13",image:"14",link:"15",linkAngleBraceStyleDetector:"16",linkBareUrlDetector:"17",linkMailtoDetector:"18",newlineCoalescer:"19",orderedList:"20",paragraph:"21",ref:"22",refImage:"23",refLink:"24",table:"25",tableSeparator:"26",text:"27",textBolded:"28",textEmphasized:"29",textEscaped:"30",textMarked:"31",textStrikethroughed:"32",unorderedList:"33"};var i;!function(e){e[e.MAX=0]="MAX",e[e.HIGH=1]="HIGH",e[e.MED=2]="MED",e[e.LOW=3]="LOW",e[e.MIN=4]="MIN"}(i||(i={}));const l=["allowFullScreen","allowTransparency","autoComplete","autoFocus","autoPlay","cellPadding","cellSpacing","charSet","classId","colSpan","contentEditable","contextMenu","crossOrigin","encType","formAction","formEncType","formMethod","formNoValidate","formTarget","frameBorder","hrefLang","inputMode","keyParams","keyType","marginHeight","marginWidth","maxLength","mediaGroup","minLength","noValidate","radioGroup","readOnly","rowSpan","spellCheck","srcDoc","srcLang","srcSet","tabIndex","useMap"].reduce((e,t)=>(e[t.toLowerCase()]=t,e),{class:"className",for:"htmlFor"}),o={amp:"&",apos:"'",gt:">",lt:"<",nbsp:" ",quot:"“"},a=["style","script"],c=["src","href","data","formAction","srcDoc","action"],s=/([-A-Z0-9_:]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|(?:\{((?:\\.|{[^}]*?}|[^}])*)\})))?/gi,d=/mailto:/i,u=/\n{2,}$/,p=/^(\s*>[\s\S]*?)(?=\n\n|$)/,f=/^ *> ?/gm,h=/^(?:\[!([^\]]*)\]\n)?([\s\S]*)/,m=/^ {2,}\n/,g=/^(?:( *[-*_])){3,} *(?:\n *)+\n/,y=/^(?: {1,3})?(`{3,}|~{3,}) *(\S+)? *([^\n]*?)?\n([\s\S]*?)(?:\1\n?|$)/,k=/^(?: {4}[^\n]+\n*)+(?:\n *)+\n?/,x=/^(`+)((?:\\`|(?!\1)`|[^`])+)\1/,b=/^(?:\n *)*\n/,v=/\r\n?/g,C=/^\[\^([^\]]+)](:(.*)((\n+ {4,}.*)|(\n(?!\[\^).+))*)/,$=/^\[\^([^\]]+)]/,S=/\f/g,w=/^---[ \t]*\n(.|\n)*\n---[ \t]*\n/,E=/^\s*?\[(x|\s)\]/,z=/^ *(#{1,6}) *([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,L=/^ *(#{1,6}) +([^\n]+?)(?: +#*)?(?:\n *)*(?:\n|$)/,A=/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/,O=/^ *(?!<[a-z][^ >/]* ?\/>)<([a-z][^ >/]*) ?((?:[^>]*[^/])?)>\n?(\s*(?:<\1[^>]*?>[\s\S]*?<\/\1>|(?!<\1\b)[\s\S])*?)<\/\1>(?!<\/\1>)\n*/i,T=/&([a-z0-9]+|#[0-9]{1,6}|#x[0-9a-fA-F]{1,6});/gi,B=/^<!--[\s\S]*?(?:-->)/,M=/^(data|aria|x)-[a-z_][a-z\d_.-]*$/,R=/^ *<([a-z][a-z0-9:]*)(?:\s+((?:<.*?>|[^>])*))?\/?>(?!<\/\1>)(\s*\n)?/i,I=/^\{.*\}$/,D=/^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,U=/^<([^ >]+@[^ >]+)>/,N=/^<([^ >]+:\/[^ >]+)>/,j=/-([a-z])?/gi,H=/^(\|.*)\n(?: *(\|? *[-:]+ *\|[-| :]*)\n((?:.*\|.*\n)*))?\n?/,P=/^\[([^\]]*)\]:\s+<?([^\s>]+)>?\s*("([^"]*)")?/,_=/^!\[([^\]]*)\] ?\[([^\]]*)\]/,F=/^\[([^\]]*)\] ?\[([^\]]*)\]/,W=/(\n|^[-*]\s|^#|^ {2,}|^-{2,}|^>\s)/,G=/\t/g,Z=/(^ *\||\| *$)/g,q=/^ *:-+: *$/,Q=/^ *:-+ *$/,V=/^ *-+: *$/,X="((?:\\[.*?\\][([].*?[)\\]]|<.*?>(?:.*?<.*?>)?|`.*?`|\\\\\\1|[\\s\\S])+?)",J=new RegExp(`^([*_])\\1${X}\\1\\1(?!\\1)`),K=new RegExp(`^([*_])${X}\\1(?!\\1)`),Y=new RegExp(`^(==)${X}\\1`),ee=new RegExp(`^(~~)${X}\\1`),te=/^\\([^0-9A-Za-z\s])/,ne=/\\([^0-9A-Za-z\s])/g,re=/^([\s\S](?:(?!  |[0-9]\.)[^=*_~\-\n<`\\\[!])*)/,ie=/^\n+/,le=/^([ \t]*)/,oe=/\\([^\\])/g,ae=/(?:^|\n)( *)$/,ce="(?:\\d+\\.)",se="(?:[*+-])";function de(e){return"( *)("+(1===e?ce:se)+") +"}const ue=de(1),pe=de(2);function fe(e){return new RegExp("^"+(1===e?ue:pe))}const he=fe(1),me=fe(2);function ge(e){return new RegExp("^"+(1===e?ue:pe)+"[^\\n]*(?:\\n(?!\\1"+(1===e?ce:se)+" )[^\\n]*)*(\\n|$)","gm")}const ye=ge(1),ke=ge(2);function xe(e){const t=1===e?ce:se;return new RegExp("^( *)("+t+") [\\s\\S]+?(?:\\n{2,}(?! )(?!\\1"+t+" (?!"+t+" ))\\n*|\\s*\\n*$)")}const be=xe(1),ve=xe(2);function Ce(e,t){const n=1===t,i=n?be:ve,l=n?ye:ke,o=n?he:me;return{match:Me(function(e,t){const n=ae.exec(t.prevCapture);return n&&(t.list||!t.inline&&!t.simple)?i.exec(e=n[1]+e):null}),order:1,parse(e,t,r){const i=n?+e[2]:void 0,a=e[0].replace(u,"\n").match(l);let c=!1;return{items:a.map(function(e,n){const i=o.exec(e)[0].length,l=new RegExp("^ {1,"+i+"}","gm"),s=e.replace(l,"").replace(o,""),d=n===a.length-1,u=-1!==s.indexOf("\n\n")||d&&c;c=u;const p=r.inline,f=r.list;let h;r.list=!0,u?(r.inline=!1,h=ze(s)+"\n\n"):(r.inline=!0,h=ze(s));const m=t(h,r);return r.inline=p,r.list=f,m}),ordered:n,start:i}},render:(t,n,i)=>e(t.ordered?"ol":"ul",{key:i.key,start:t.type===r.orderedList?t.start:void 0},t.items.map(function(t,r){return e("li",{key:r},n(t,i))}))}}const $e=new RegExp("^\\[((?:\\[[^\\]]*\\]|[^\\[\\]]|\\](?=[^\\[]*\\]))*)\\]\\(\\s*<?((?:\\([^)]*\\)|[^\\s\\\\]|\\\\.)*?)>?(?:\\s+['\"]([\\s\\S]*?)['\"])?\\s*\\)"),Se=/^!\[(.*?)\]\( *((?:\([^)]*\)|[^() ])*) *"?([^)"]*)?"?\)/,we=[p,y,k,z,A,L,H,be,ve],Ee=[...we,/^[^\n]+(?:  \n|\n{2,})/,O,B,R];function ze(e){let t=e.length;for(;t>0&&e[t-1]<=" ";)t--;return e.slice(0,t)}function Le(e){return e.replace(/[ÀÁÂÃÄÅàáâãäåæÆ]/g,"a").replace(/[çÇ]/g,"c").replace(/[ðÐ]/g,"d").replace(/[ÈÉÊËéèêë]/g,"e").replace(/[ÏïÎîÍíÌì]/g,"i").replace(/[Ññ]/g,"n").replace(/[øØœŒÕõÔôÓóÒò]/g,"o").replace(/[ÜüÛûÚúÙù]/g,"u").replace(/[ŸÿÝý]/g,"y").replace(/[^a-z0-9- ]/gi,"").replace(/ /gi,"-").toLowerCase()}function Ae(e){return V.test(e)?"right":q.test(e)?"center":Q.test(e)?"left":null}function Oe(e,t,n,r){const i=n.inTable;n.inTable=!0;let l=[[]],o="";function a(){if(!o)return;const e=l[l.length-1];e.push.apply(e,t(o,n)),o=""}return e.trim().split(/(`[^`]*`|\\\||\|)/).filter(Boolean).forEach((e,t,n)=>{"|"===e.trim()&&(a(),r)?0!==t&&t!==n.length-1&&l.push([]):o+=e}),a(),n.inTable=i,l}function Te(e,t,n){n.inline=!0;const i=e[2]?e[2].replace(Z,"").split("|").map(Ae):[],l=e[3]?function(e,t,n){return e.trim().split("\n").map(function(e){return Oe(e,t,n,!0)})}(e[3],t,n):[],o=Oe(e[1],t,n,!!l.length);return n.inline=!1,l.length?{align:i,cells:l,header:o,type:r.table}:{children:o,type:r.paragraph}}function Be(e,t){return null==e.align[t]?{}:{textAlign:e.align[t]}}function Me(e){return e.inline=1,e}function Re(e){return Me(function(t,n){return n.inline?e.exec(t):null})}function Ie(e){return Me(function(t,n){return n.inline||n.simple?e.exec(t):null})}function De(e){return function(t,n){return n.inline||n.simple?null:e.exec(t)}}function Ue(e){return Me(function(t){return e.exec(t)})}function Ne(e,t){if(t.inline||t.simple)return null;let n="";e.split("\n").every(e=>(e+="\n",!we.some(t=>t.test(e))&&(n+=e,!!e.trim())));const r=ze(n);return""==r?null:[n,,r]}const je=/(javascript|vbscript|data(?!:image)):/i;function He(e){try{const t=decodeURIComponent(e).replace(/[^A-Za-z0-9/:]/g,"");if(je.test(t))return null}catch(e){return null}return e}function Pe(e){return e.replace(oe,"$1")}function _e(e,t,n){const r=n.inline||!1,i=n.simple||!1;n.inline=!0,n.simple=!0;const l=e(t,n);return n.inline=r,n.simple=i,l}function Fe(e,t,n){const r=n.inline||!1,i=n.simple||!1;n.inline=!1,n.simple=!0;const l=e(t,n);return n.inline=r,n.simple=i,l}function We(e,t,n){const r=n.inline||!1;n.inline=!1;const i=e(t,n);return n.inline=r,i}const Ge=(e,t,n)=>({children:_e(t,e[2],n)});function Ze(){return{}}function qe(){return null}function Qe(...e){return e.filter(Boolean).join(" ")}function Ve(e,t,n){let r=e;const i=t.split(".");for(;i.length&&(r=r[i[0]],void 0!==r);)i.shift();return r||n}function Xe(n="",i={}){function u(e,n,...r){const l=Ve(i.overrides,`${e}.props`,{});return i.createElement(function(e,t){const n=Ve(t,e);return n?"function"==typeof n||"object"==typeof n&&"render"in n?n:Ve(t,`${e}.component`,e):e}(e,i.overrides),t({},n,l,{className:Qe(null==n?void 0:n.className,l.className)||void 0}),...r)}function Z(e){e=e.replace(w,"");let t=!1;i.forceInline?t=!0:i.forceBlock||(t=!1===W.test(e));const n=ae(oe(t?e:`${ze(e).replace(ie,"")}\n\n`,{inline:t}));for(;"string"==typeof n[n.length-1]&&!n[n.length-1].trim();)n.pop();if(null===i.wrapper)return n;const r=i.wrapper||(t?"span":"div");let l;if(n.length>1||i.forceWrapper)l=n;else{if(1===n.length)return l=n[0],"string"==typeof l?u("span",{key:"outer"},l):l;l=null}return i.createElement(r,{key:"outer"},l)}function q(e,t){const n=t.match(s);return n?n.reduce(function(t,n){const r=n.indexOf("=");if(-1!==r){const o=function(e){return-1!==e.indexOf("-")&&null===e.match(M)&&(e=e.replace(j,function(e,t){return t.toUpperCase()})),e}(n.slice(0,r)).trim(),a=function(e){const t=e[0];return('"'===t||"'"===t)&&e.length>=2&&e[e.length-1]===t?e.slice(1,-1):e}(n.slice(r+1).trim()),s=l[o]||o;if("ref"===s)return t;const d=t[s]=function(e,t,n,r){return"style"===t?function(e){const t=[];let n="",r=!1,i=!1,l="";if(!e)return t;for(let o=0;o<e.length;o++){const a=e[o];if('"'!==a&&"'"!==a||r||(i?a===l&&(i=!1,l=""):(i=!0,l=a)),"("===a&&n.endsWith("url")?r=!0:")"===a&&r&&(r=!1),";"!==a||i||r)n+=a;else{const e=n.trim();if(e){const n=e.indexOf(":");if(n>0){const r=e.slice(0,n).trim(),i=e.slice(n+1).trim();t.push([r,i])}}n=""}}const o=n.trim();if(o){const e=o.indexOf(":");if(e>0){const n=o.slice(0,e).trim(),r=o.slice(e+1).trim();t.push([n,r])}}return t}(n).reduce(function(t,[n,i]){return t[n.replace(/(-[a-z])/g,e=>e[1].toUpperCase())]=r(i,e,n),t},{}):-1!==c.indexOf(t)?r(n,e,t):(n.match(I)&&(n=n.slice(1,n.length-1)),"true"===n||"false"!==n&&n)}(e,o,a,i.sanitizer);"string"==typeof d&&(O.test(d)||R.test(d))&&(t[s]=Z(d.trim()))}else"style"!==n&&(t[l[n]||n]=!0);return t},{}):null}i.overrides=i.overrides||{},i.sanitizer=i.sanitizer||He,i.slugify=i.slugify||Le,i.namedCodesToUnicode=i.namedCodesToUnicode?t({},o,i.namedCodesToUnicode):o,i.createElement=i.createElement||react__WEBPACK_IMPORTED_MODULE_0__.createElement;const Q=[],V={},X={[r.blockQuote]:{match:De(p),order:1,parse(e,t,n){const[,r,i]=e[0].replace(f,"").match(h);return{alert:r,children:t(i,n)}},render(e,t,n){const l={key:n.key};return e.alert&&(l.className="markdown-alert-"+i.slugify(e.alert.toLowerCase(),Le),e.children.unshift({attrs:{},children:[{type:r.text,text:e.alert}],noInnerParse:!0,type:r.htmlBlock,tag:"header"})),u("blockquote",l,t(e.children,n))}},[r.breakLine]:{match:Ue(m),order:1,parse:Ze,render:(e,t,n)=>u("br",{key:n.key})},[r.breakThematic]:{match:De(g),order:1,parse:Ze,render:(e,t,n)=>u("hr",{key:n.key})},[r.codeBlock]:{match:De(k),order:0,parse:e=>({lang:void 0,text:ze(e[0].replace(/^ {4}/gm,"")).replace(ne,"$1")}),render:(e,n,r)=>u("pre",{key:r.key},u("code",t({},e.attrs,{className:e.lang?`lang-${e.lang}`:""}),e.text))},[r.codeFenced]:{match:De(y),order:0,parse:e=>({attrs:q("code",e[3]||""),lang:e[2]||void 0,text:e[4],type:r.codeBlock})},[r.codeInline]:{match:Ie(x),order:3,parse:e=>({text:e[2].replace(ne,"$1")}),render:(e,t,n)=>u("code",{key:n.key},e.text)},[r.footnote]:{match:De(C),order:0,parse:e=>(Q.push({footnote:e[2],identifier:e[1]}),{}),render:qe},[r.footnoteReference]:{match:Re($),order:1,parse:e=>({target:`#${i.slugify(e[1],Le)}`,text:e[1]}),render:(e,t,n)=>u("a",{key:n.key,href:i.sanitizer(e.target,"a","href")},u("sup",{key:n.key},e.text))},[r.gfmTask]:{match:Re(E),order:1,parse:e=>({completed:"x"===e[1].toLowerCase()}),render:(e,t,n)=>u("input",{checked:e.completed,key:n.key,readOnly:!0,type:"checkbox"})},[r.heading]:{match:De(i.enforceAtxHeadings?L:z),order:1,parse:(e,t,n)=>({children:_e(t,e[2],n),id:i.slugify(e[2],Le),level:e[1].length}),render:(e,t,n)=>u(`h${e.level}`,{id:e.id,key:n.key},t(e.children,n))},[r.headingSetext]:{match:De(A),order:0,parse:(e,t,n)=>({children:_e(t,e[1],n),level:"="===e[2]?1:2,type:r.heading})},[r.htmlBlock]:{match:Ue(O),order:1,parse(e,t,n){const[,r]=e[3].match(le),i=new RegExp(`^${r}`,"gm"),l=e[3].replace(i,""),o=(c=l,Ee.some(e=>e.test(c))?We:_e);var c;const s=e[1].toLowerCase(),d=-1!==a.indexOf(s),u=(d?s:e[1]).trim(),p={attrs:q(u,e[2]),noInnerParse:d,tag:u};return n.inAnchor=n.inAnchor||"a"===s,d?p.text=e[3]:p.children=o(t,l,n),n.inAnchor=!1,p},render:(e,n,r)=>u(e.tag,t({key:r.key},e.attrs),e.text||(e.children?n(e.children,r):""))},[r.htmlSelfClosing]:{match:Ue(R),order:1,parse(e){const t=e[1].trim();return{attrs:q(t,e[2]||""),tag:t}},render:(e,n,r)=>u(e.tag,t({},e.attrs,{key:r.key}))},[r.htmlComment]:{match:Ue(B),order:1,parse:()=>({}),render:qe},[r.image]:{match:Ie(Se),order:1,parse:e=>({alt:e[1],target:Pe(e[2]),title:e[3]}),render:(e,t,n)=>u("img",{key:n.key,alt:e.alt||void 0,title:e.title||void 0,src:i.sanitizer(e.target,"img","src")})},[r.link]:{match:Re($e),order:3,parse:(e,t,n)=>({children:Fe(t,e[1],n),target:Pe(e[2]),title:e[3]}),render:(e,t,n)=>u("a",{key:n.key,href:i.sanitizer(e.target,"a","href"),title:e.title},t(e.children,n))},[r.linkAngleBraceStyleDetector]:{match:Re(N),order:0,parse:e=>({children:[{text:e[1],type:r.text}],target:e[1],type:r.link})},[r.linkBareUrlDetector]:{match:Me((e,t)=>t.inAnchor||i.disableAutoLink?null:Re(D)(e,t)),order:0,parse:e=>({children:[{text:e[1],type:r.text}],target:e[1],title:void 0,type:r.link})},[r.linkMailtoDetector]:{match:Re(U),order:0,parse(e){let t=e[1],n=e[1];return d.test(n)||(n="mailto:"+n),{children:[{text:t.replace("mailto:",""),type:r.text}],target:n,type:r.link}}},[r.orderedList]:Ce(u,1),[r.unorderedList]:Ce(u,2),[r.newlineCoalescer]:{match:De(b),order:3,parse:Ze,render:()=>"\n"},[r.paragraph]:{match:Me(Ne),order:3,parse:Ge,render:(e,t,n)=>u("p",{key:n.key},t(e.children,n))},[r.ref]:{match:Re(P),order:0,parse:e=>(V[e[1]]={target:e[2],title:e[4]},{}),render:qe},[r.refImage]:{match:Ie(_),order:0,parse:e=>({alt:e[1]||void 0,ref:e[2]}),render:(e,t,n)=>V[e.ref]?u("img",{key:n.key,alt:e.alt,src:i.sanitizer(V[e.ref].target,"img","src"),title:V[e.ref].title}):null},[r.refLink]:{match:Re(F),order:0,parse:(e,t,n)=>({children:t(e[1],n),fallbackChildren:e[0],ref:e[2]}),render:(e,t,n)=>V[e.ref]?u("a",{key:n.key,href:i.sanitizer(V[e.ref].target,"a","href"),title:V[e.ref].title},t(e.children,n)):u("span",{key:n.key},e.fallbackChildren)},[r.table]:{match:De(H),order:1,parse:Te,render(e,t,n){const r=e;return u("table",{key:n.key},u("thead",null,u("tr",null,r.header.map(function(e,i){return u("th",{key:i,style:Be(r,i)},t(e,n))}))),u("tbody",null,r.cells.map(function(e,i){return u("tr",{key:i},e.map(function(e,i){return u("td",{key:i,style:Be(r,i)},t(e,n))}))})))}},[r.text]:{match:Ue(re),order:4,parse:e=>({text:e[0].replace(T,(e,t)=>i.namedCodesToUnicode[t]?i.namedCodesToUnicode[t]:e)}),render:e=>e.text},[r.textBolded]:{match:Ie(J),order:2,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,n)=>u("strong",{key:n.key},t(e.children,n))},[r.textEmphasized]:{match:Ie(K),order:3,parse:(e,t,n)=>({children:t(e[2],n)}),render:(e,t,n)=>u("em",{key:n.key},t(e.children,n))},[r.textEscaped]:{match:Ie(te),order:1,parse:e=>({text:e[1],type:r.text})},[r.textMarked]:{match:Ie(Y),order:3,parse:Ge,render:(e,t,n)=>u("mark",{key:n.key},t(e.children,n))},[r.textStrikethroughed]:{match:Ie(ee),order:3,parse:Ge,render:(e,t,n)=>u("del",{key:n.key},t(e.children,n))}};!0===i.disableParsingRawHTML&&(delete X[r.htmlBlock],delete X[r.htmlSelfClosing]);const oe=function(e){let t=Object.keys(e);function n(r,i){let l,o,a=[],c="",s="";for(i.prevCapture=i.prevCapture||"";r;){let d=0;for(;d<t.length;){if(c=t[d],l=e[c],i.inline&&!l.match.inline){d++;continue}const u=l.match(r,i);if(u){s=u[0],i.prevCapture+=s,r=r.substring(s.length),o=l.parse(u,n,i),null==o.type&&(o.type=c),a.push(o);break}d++}}return i.prevCapture="",a}return t.sort(function(t,n){let r=e[t].order,i=e[n].order;return r!==i?r-i:t<n?-1:1}),function(e,t){return n(function(e){return e.replace(v,"\n").replace(S,"").replace(G,"    ")}(e),t)}}(X),ae=(ce=function(e,t){return function(n,r,i){const l=e[n.type].render;return t?t(()=>l(n,r,i),n,r,i):l(n,r,i)}}(X,i.renderRule),function e(t,n={}){if(Array.isArray(t)){const r=n.key,i=[];let l=!1;for(let r=0;r<t.length;r++){n.key=r;const o=e(t[r],n),a="string"==typeof o;a&&l?i[i.length-1]+=o:null!==o&&i.push(o),l=a}return n.key=r,i}return ce(t,e,n)});var ce;const se=Z(n);return Q.length?u("div",null,se,u("footer",{key:"footer"},Q.map(function(e){return u("div",{id:i.slugify(e.identifier,Le),key:e.identifier},e.identifier,ae(oe(e.footnote,{inline:!0})))}))):se}/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (t=>{let{children:r="",options:i}=t,l=function(e,t){if(null==e)return{};var n,r,i={},l=Object.keys(e);for(r=0;r<l.length;r++)t.indexOf(n=l[r])>=0||(i[n]=e[n]);return i}(t,n);return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(Xe(r,i),l)});
//# sourceMappingURL=index.modern.js.map


/***/ }),

/***/ "./node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js":
/*!******************************************************************************************************!*\
  !*** ./node_modules/react-textarea-autosize/dist/react-textarea-autosize.browser.development.esm.js ***!
  \******************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ index)
/* harmony export */ });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/esm/objectWithoutPropertiesLoose */ "./node_modules/@babel/runtime/helpers/esm/objectWithoutPropertiesLoose.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var use_latest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! use-latest */ "./node_modules/use-latest/dist/use-latest.esm.js");
/* harmony import */ var use_composed_ref__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! use-composed-ref */ "./node_modules/use-composed-ref/dist/use-composed-ref.esm.js");






var HIDDEN_TEXTAREA_STYLE = {
  'min-height': '0',
  'max-height': 'none',
  height: '0',
  visibility: 'hidden',
  overflow: 'hidden',
  position: 'absolute',
  'z-index': '-1000',
  top: '0',
  right: '0',
  display: 'block'
};
var forceHiddenStyles = function forceHiddenStyles(node) {
  Object.keys(HIDDEN_TEXTAREA_STYLE).forEach(function (key) {
    node.style.setProperty(key, HIDDEN_TEXTAREA_STYLE[key], 'important');
  });
};
var forceHiddenStyles$1 = forceHiddenStyles;

var hiddenTextarea = null;
var getHeight = function getHeight(node, sizingData) {
  var height = node.scrollHeight;
  if (sizingData.sizingStyle.boxSizing === 'border-box') {
    // border-box: add border, since height = content + padding + border
    return height + sizingData.borderSize;
  }

  // remove padding, since height = content
  return height - sizingData.paddingSize;
};
function calculateNodeHeight(sizingData, value, minRows, maxRows) {
  if (minRows === void 0) {
    minRows = 1;
  }
  if (maxRows === void 0) {
    maxRows = Infinity;
  }
  if (!hiddenTextarea) {
    hiddenTextarea = document.createElement('textarea');
    hiddenTextarea.setAttribute('tabindex', '-1');
    hiddenTextarea.setAttribute('aria-hidden', 'true');
    forceHiddenStyles$1(hiddenTextarea);
  }
  if (hiddenTextarea.parentNode === null) {
    document.body.appendChild(hiddenTextarea);
  }
  var paddingSize = sizingData.paddingSize,
    borderSize = sizingData.borderSize,
    sizingStyle = sizingData.sizingStyle;
  var boxSizing = sizingStyle.boxSizing;
  Object.keys(sizingStyle).forEach(function (_key) {
    var key = _key;
    hiddenTextarea.style[key] = sizingStyle[key];
  });
  forceHiddenStyles$1(hiddenTextarea);
  hiddenTextarea.value = value;
  var height = getHeight(hiddenTextarea, sizingData);
  // Double set and calc due to Firefox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1795904
  hiddenTextarea.value = value;
  height = getHeight(hiddenTextarea, sizingData);

  // measure height of a textarea with a single row
  hiddenTextarea.value = 'x';
  var rowHeight = hiddenTextarea.scrollHeight - paddingSize;
  var minHeight = rowHeight * minRows;
  if (boxSizing === 'border-box') {
    minHeight = minHeight + paddingSize + borderSize;
  }
  height = Math.max(minHeight, height);
  var maxHeight = rowHeight * maxRows;
  if (boxSizing === 'border-box') {
    maxHeight = maxHeight + paddingSize + borderSize;
  }
  height = Math.min(maxHeight, height);
  return [height, rowHeight];
}

var noop = function noop() {};
var pick = function pick(props, obj) {
  return props.reduce(function (acc, prop) {
    acc[prop] = obj[prop];
    return acc;
  }, {});
};

var SIZING_STYLE = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontStyle', 'fontWeight', 'letterSpacing', 'lineHeight', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop',
// non-standard
'tabSize', 'textIndent',
// non-standard
'textRendering', 'textTransform', 'width', 'wordBreak', 'wordSpacing', 'scrollbarGutter'];
var isIE = !!document.documentElement.currentStyle ;
var getSizingData = function getSizingData(node) {
  var style = window.getComputedStyle(node);
  if (style === null) {
    return null;
  }
  var sizingStyle = pick(SIZING_STYLE, style);
  var boxSizing = sizingStyle.boxSizing;

  // probably node is detached from DOM, can't read computed dimensions
  if (boxSizing === '') {
    return null;
  }

  // IE (Edge has already correct behaviour) returns content width as computed width
  // so we need to add manually padding and border widths
  if (isIE && boxSizing === 'border-box') {
    sizingStyle.width = parseFloat(sizingStyle.width) + parseFloat(sizingStyle.borderRightWidth) + parseFloat(sizingStyle.borderLeftWidth) + parseFloat(sizingStyle.paddingRight) + parseFloat(sizingStyle.paddingLeft) + 'px';
  }
  var paddingSize = parseFloat(sizingStyle.paddingBottom) + parseFloat(sizingStyle.paddingTop);
  var borderSize = parseFloat(sizingStyle.borderBottomWidth) + parseFloat(sizingStyle.borderTopWidth);
  return {
    sizingStyle: sizingStyle,
    paddingSize: paddingSize,
    borderSize: borderSize
  };
};
var getSizingData$1 = getSizingData;

function useListener(target, type, listener) {
  var latestListener = (0,use_latest__WEBPACK_IMPORTED_MODULE_3__["default"])(listener);
  react__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect(function () {
    var handler = function handler(ev) {
      return latestListener.current(ev);
    };
    // might happen if document.fonts is not defined, for instance
    if (!target) {
      return;
    }
    target.addEventListener(type, handler);
    return function () {
      return target.removeEventListener(type, handler);
    };
  }, []);
}
var useFormResetListener = function useFormResetListener(libRef, listener) {
  useListener(document.body, 'reset', function (ev) {
    if (libRef.current.form === ev.target) {
      listener(ev);
    }
  });
};
var useWindowResizeListener = function useWindowResizeListener(listener) {
  useListener(window, 'resize', listener);
};
var useFontsLoadedListener = function useFontsLoadedListener(listener) {
  useListener(document.fonts, 'loadingdone', listener);
};

var _excluded = ["cacheMeasurements", "maxRows", "minRows", "onChange", "onHeightChange"];
var TextareaAutosize = function TextareaAutosize(_ref, userRef) {
  var cacheMeasurements = _ref.cacheMeasurements,
    maxRows = _ref.maxRows,
    minRows = _ref.minRows,
    _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === void 0 ? noop : _ref$onChange,
    _ref$onHeightChange = _ref.onHeightChange,
    onHeightChange = _ref$onHeightChange === void 0 ? noop : _ref$onHeightChange,
    props = (0,_babel_runtime_helpers_esm_objectWithoutPropertiesLoose__WEBPACK_IMPORTED_MODULE_1__["default"])(_ref, _excluded);
  if (props.style) {
    if ('maxHeight' in props.style) {
      throw new Error('Using `style.maxHeight` for <TextareaAutosize/> is not supported. Please use `maxRows`.');
    }
    if ('minHeight' in props.style) {
      throw new Error('Using `style.minHeight` for <TextareaAutosize/> is not supported. Please use `minRows`.');
    }
  }
  var isControlled = props.value !== undefined;
  var libRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(null);
  var ref = (0,use_composed_ref__WEBPACK_IMPORTED_MODULE_4__["default"])(libRef, userRef);
  var heightRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef(0);
  var measurementsCacheRef = react__WEBPACK_IMPORTED_MODULE_2__.useRef();
  var resizeTextarea = function resizeTextarea() {
    var node = libRef.current;
    var nodeSizingData = cacheMeasurements && measurementsCacheRef.current ? measurementsCacheRef.current : getSizingData$1(node);
    if (!nodeSizingData) {
      return;
    }
    measurementsCacheRef.current = nodeSizingData;
    var _calculateNodeHeight = calculateNodeHeight(nodeSizingData, node.value || node.placeholder || 'x', minRows, maxRows),
      height = _calculateNodeHeight[0],
      rowHeight = _calculateNodeHeight[1];
    if (heightRef.current !== height) {
      heightRef.current = height;
      node.style.setProperty('height', height + "px", 'important');
      onHeightChange(height, {
        rowHeight: rowHeight
      });
    }
  };
  var handleChange = function handleChange(event) {
    if (!isControlled) {
      resizeTextarea();
    }
    onChange(event);
  };
  {
    react__WEBPACK_IMPORTED_MODULE_2__.useLayoutEffect(resizeTextarea);
    useFormResetListener(libRef, function () {
      if (!isControlled) {
        var currentValue = libRef.current.value;
        requestAnimationFrame(function () {
          var node = libRef.current;
          if (node && currentValue !== node.value) {
            resizeTextarea();
          }
        });
      }
    });
    useWindowResizeListener(resizeTextarea);
    useFontsLoadedListener(resizeTextarea);
    return /*#__PURE__*/react__WEBPACK_IMPORTED_MODULE_2__.createElement("textarea", (0,_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({}, props, {
      onChange: handleChange,
      ref: ref
    }));
  }
};
var index = /* #__PURE__ */react__WEBPACK_IMPORTED_MODULE_2__.forwardRef(TextareaAutosize);




/***/ }),

/***/ "./node_modules/use-composed-ref/dist/use-composed-ref.esm.js":
/*!********************************************************************!*\
  !*** ./node_modules/use-composed-ref/dist/use-composed-ref.esm.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useComposedRef)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


// basically Exclude<React.ClassAttributes<T>["ref"], string>

var updateRef = function updateRef(ref, value) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }
  ref.current = value;
};
var useComposedRef = function useComposedRef(libRef, userRef) {
  var prevUserRef = react__WEBPACK_IMPORTED_MODULE_0___default().useRef();
  return react__WEBPACK_IMPORTED_MODULE_0___default().useCallback(function (instance) {
    libRef.current = instance;
    if (prevUserRef.current) {
      updateRef(prevUserRef.current, null);
    }
    prevUserRef.current = userRef;
    if (!userRef) {
      return;
    }
    updateRef(userRef, instance);
  }, [userRef]);
};




/***/ }),

/***/ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js":
/*!****************************************************************************************************!*\
  !*** ./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js ***!
  \****************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ index)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var index = react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect ;




/***/ }),

/***/ "./node_modules/use-latest/dist/use-latest.esm.js":
/*!********************************************************!*\
  !*** ./node_modules/use-latest/dist/use-latest.esm.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useLatest)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! use-isomorphic-layout-effect */ "./node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js");



var useLatest = function useLatest(value) {
  var ref = react__WEBPACK_IMPORTED_MODULE_0___default().useRef(value);
  (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
    ref.current = value;
  });
  return ref;
};




/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = React;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!***************************!*\
  !*** ./app/js/chatbot.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _app_chatbot_ChatbotSystem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @app/chatbot/ChatbotSystem */ "./app/js/chatbot/ChatbotSystem.js");
/* harmony import */ var _app_chatbot_DiscussionsSystem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @app/chatbot/DiscussionsSystem */ "./app/js/chatbot/DiscussionsSystem.js");
// Previous: 1.9.8
// Current: 2.5.0

const {
  render
} = wp.element;


function decodeHtmlEntities(encodedStr) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = encodedStr;
  return textarea.value;
}
document.addEventListener('DOMContentLoaded', function () {
  function processContainers(containers, component) {
    containers.forEach(container => {
      const params = JSON.parse(decodeHtmlEntities(container.getAttribute('data-params')));
      const system = JSON.parse(decodeHtmlEntities(container.getAttribute('data-system')));
      const theme = JSON.parse(decodeHtmlEntities(container.getAttribute('data-theme')));
      container.removeAttribute('data-params');
      container.removeAttribute('data-system');
      container.removeAttribute('data-theme');
      render(component({
        system,
        params,
        theme
      }), container);
    });
  }
  const chatbotContainers = document.querySelectorAll('.mwai-chatbot-container');
  processContainers(chatbotContainers, _app_chatbot_ChatbotSystem__WEBPACK_IMPORTED_MODULE_0__["default"]);
  const discussionsContainers = document.querySelectorAll('.mwai-discussions-container');
  processContainers(discussionsContainers, _app_chatbot_DiscussionsSystem__WEBPACK_IMPORTED_MODULE_1__["default"]);
});
})();

/******/ })()
;
//# sourceMappingURL=chatbot.js.map