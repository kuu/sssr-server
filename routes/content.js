const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const debug = require('debug');
const config = require('config');

const modelConfig = require('../models/config');
const modelAssets = require('../models/assets');

require('babel-register')({
  plugins: ['transform-react-jsx'],
  only: /custom-skin/
});

const Skin = require('../custom-skin/js/skin');
const Utils = require('../custom-skin/js/components/utils');

const router = express.Router();
const print = debug('sssr');

const {pcode, playerBrandingId, version} = config.player;

const state = {
  playerParam: {
    pcode,
    playerBrandingId,
    debug: true,
    skin: {
      config: '/skin.json'
    }
  },
  persistentSettings: {
    closedCaptionOptions: {}
  },
  assetId: null,
  contentTree: null,
  thumbnails: null,
  isLiveStream: false,
  screenToShow: 'startScreen',
  playerState: 'start',
  discoveryData: null,
  isPlayingAd: false,
  adOverlayUrl: null,
  showAdOverlay: false,
  showAdOverlayCloseButton: false,
  showAdControls: true,
  showAdMarquee: true,
  configLoaded: false,
  config: {},
  fullscreen: false,
  pauseAnimationDisabled: false,
  adPauseAnimationDisabled: true,
  pausedCallback: null,
  seeking: false,
  queuedPlayheadUpdate: null,
  accessibilityControlsEnabled: false,
  duration: 0,
  mainVideoDuration: 0,
  adVideoDuration: 0,
  adStartTime: 0,
  elementId: 'container',
  mainVideoContainer: null,
  mainVideoInnerWrapper: null,
  mainVideoElement: null,
  mainVideoMediaType: 'html5',
  mainVideoAspectRatio: 0,
  pluginsElement: null,
  pluginsClickElement: null,
  buffering: false,
  mainVideoBuffered: null,
  mainVideoPlayhead: null,
  focusedElement: null,

  currentAdsInfo: {
    currentAdItem: null,
    numberOfAds: 0,
    skipAdButtonEnabled: false
  },

  closedCaptionsInfoCache: {},
  closedCaptionOptions: {
    enabled: null,
    language: null,
    availableLanguages: null,
    cueText: null,
    showClosedCaptionPopover: false,
    textColor: null,
    windowColor: null,
    backgroundColor: null,
    textOpacity: null,
    backgroundOpacity: null,
    windowOpacity: null,
    fontType: null,
    fontSize: null,
    textEnhancement: null
  },

  videoQualityOptions: {
    availableBitrates: null,
    selectedBitrate: null,
    showVideoQualityPopover: false
  },

  volumeState: {
    volume: 1,
    muted: false,
    oldVolume: 1,
    volumeSliderVisible: false
  },

  upNextInfo: {
    upNextData: null,
    countDownFinished: false,
    countDownCancelled: false,
    timeToShow: 0,
    showing: false,
    delayedSetEmbedCodeEvent: false,
    delayedContentData: null
  },

  moreOptionsItems: null,

  isMobile: false,
  controlBarVisible: true,
  forceControlBarVisible: false,
  timer: null,
  errorCode: null,
  isSubscribed: false,
  isPlaybackReadySubscribed: true,
  isSkipAdClicked: false,
  isInitialPlay: false,
  isFullScreenSupported: false,
  isVideoFullScreenSupported: false,
  isFullWindow: false,
  autoPauseDisabled: false,
  browserSupportsTouch: false,
  responsiveClass: 'oo-large'
};

router.get('/:id', (req, res) => {
  const embedCode = req.params.id;
  const off = req.query.off !== undefined;

  print(`/content/${embedCode} called. off=${off}`);

  state.assetId = embedCode;

  if (off) {
    res.render('content', {embedCode, pcode, playerBrandingId, version, serverData: '{}', topLevel: ''});
    return;
  }
  Promise.all([
    modelAssets.getThumbnails(embedCode),
    modelAssets.getContentTree(pcode, embedCode),
    modelConfig.getConfigData()
  ])
  .then(([thumbnails, contentTree, configData]) => {
    let serverData;
    const skinConfig = configData.skinConfig;
    const localizableStrings = configData.localizableStrings;
    const closedCaptionOptions = skinConfig.closedCaptionOptions;
    try {
      serverData = JSON.stringify({
        skinConfig,
        localizableStrings
      });
    } catch (err) {
      console.error(`${err.message} ${err.stack}`);
      serverData = '{}';
    }
    let topLevel;
    state.config = skinConfig;
    state.thumbnails = thumbnails;
    state.contentTree = contentTree;
    try {
      topLevel = ReactDOMServer.renderToString(
        React.createElement(Skin, {
          skinConfig,
          localizableStrings,
          language: Utils.getLanguageToUse(skinConfig),
          controller: () => ({state}),
          closedCaptionOptions,
          pauseAnimationDisabled: state.pauseAnimationDisabled
        })
      );
    } catch (err) {
      console.error(`${err.message} ${err.stack}`);
      topLevel = '';
    }
    res.render('content', {embedCode, pcode, playerBrandingId, version, serverData, topLevel});
  });
});

module.exports = router;
