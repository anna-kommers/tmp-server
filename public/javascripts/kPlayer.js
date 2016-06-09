'strict mode'

function KPlayer(videoContainer) {
  let
    self = this,
    container = $('.' + videoContainer).first();

  this.videoObj = $('.video', container).get(0);

  this.$playPause = null;
  this.$mute = null;
  this.$progressBar = null;
  this.$fullProgressBar = null;
  this.$timeLine = null;

  this.stopPoints = [];
  this.stopPointsTimer = {};
  this.activeStopPoint = {};

  this.isPlaying = false;
  this.isPlayback = false;
  this.isMuted = false;

  this.playProgressInterval = null;
  this.stopPointTimeout = null;
};

KPlayer.prototype.play = function() {
  this._resetEndpoint();
  this.videoObj.play();
  this.startProgress();
  this.isPlaying = true;
  this._changePlayIcon();
}

KPlayer.prototype._changePlayIcon = function() {
  this.isPlaying
    ? this.$playPause.removeClass('playPause_play').addClass('playPause_pause')
    : this.$playPause.removeClass('playPause_pause').addClass('playPause_play')
}

KPlayer.prototype.pause = function() {
  this.videoObj.pause();
  this.stopProgress();
  this.isPlaying = false;
  this._changePlayIcon();
}

KPlayer.prototype.nextStopPoint = function() {
  console.log('ACTIVE: ', this.activeStopPoint.time);

  let
    stopPoint = null,
    nextPoints = [];

  for (let i = 0; i < this.stopPoints.length; i++) {
    let stopPoint = this.stopPoints[i];

    if (stopPoint.time > this.activeStopPoint.time) {

      nextPoints.push(stopPoint.time);
    }



  }

  Math.min.apply(null, nextPoints);
  console.log(Math.min.apply(null, nextPoints));

  stopPoint && this.goToStopPoint(stopPoint);
}

KPlayer.prototype.prevStopPoint = function() {
  let stopPoint = null;

  stopPoint && this.goToStopPoint(stopPoint);
}

KPlayer.prototype.mute = function() {
  this.videoObj.muted = this.isMuted = !this.videoObj.muted;
  this._changeMuteIcon();
}

KPlayer.prototype._changeMuteIcon = function() {
  this.isMuted
    ? this.$mute.removeClass('muteButton_mute').addClass('muteButton_unmute')
    : this.$mute.removeClass('muteButton_unmute').addClass('muteButton_mute');
}

KPlayer.prototype.startProgress = function() {
  function progressTasks() {
    let
      duration = this.videoObj.duration,
      currentTime = this.videoObj.currentTime,
      fixedCurrentTime = ~~(currentTime * 10) / 10,
      stopPointIndex = this.stopPointsTimer && this.stopPointsTimer[fixedCurrentTime];

    this.$progressBar.width((currentTime / duration) * this.$fullProgressBar.width());
    if (stopPointIndex !== undefined) {
      this._showEndpoint(this.stopPoints[stopPointIndex]);
    }
  }

  this.stopProgress();
  this.playProgressInterval = setInterval(progressTasks.bind(this), 50);
}

KPlayer.prototype.stopProgress = function() {
  clearTimeout(this.playProgressInterval);
}

KPlayer.prototype.stopPlayback = function() {
  this.pause();
  this.isPlayback = false;
  this._clearEndpointTimer();
}

KPlayer.prototype.startPlayback = function() {
  this.play();
  this.isPlayback = true;
}

KPlayer.prototype._clearEndpointTimer = function() {
  clearTimeout(this.stopPointTimeout);
}

KPlayer.prototype._resetEndpoint = function() {
  $('.video').show();
  $('.endPoint').hide();
  this._clearEndpointTimer();
}

KPlayer.prototype.setPlayProgress = function(clickX, isInSeconds) {
  if (isInSeconds) {
    let
      duration = this.videoObj.duration;

    this.$progressBar.width((clickX / duration) * this.$fullProgressBar.width());
    this.videoObj.currentTime = clickX;
  } else {
    let
      progressHolder = this.$timeLine,
      curleft = progressHolder.offset().left,
      curProgressHolder = progressHolder.offsetParent();

    curleft += curProgressHolder.offset().left;

    let newPercent = Math.max( 0, Math.min(1, (clickX - curleft) / progressHolder.outerWidth()) );

    this.videoObj.currentTime = newPercent * this.videoObj.duration;
    this.$progressBar.width(newPercent * (progressHolder.outerWidth()));
  }
}

KPlayer.prototype.setStopPoints = function(stopPoints) {
  this.stopPoints = stopPoints;

  let getDurationInt = setInterval(function() {
    let duration = this.videoObj.duration;

    if (duration) {
      clearTimeout(getDurationInt);

      let
        progressHolder = this.$timeLine,
        curleft = progressHolder.offset().left,
        curProgressHolder = progressHolder.offsetParent();

      curleft += curProgressHolder.offset().left;

      for (let i = 0; i < this.stopPoints.length; i++) {
        let stopPoint = this.stopPoints[i];
        this.stopPoints[i].isActive = false;

        this.stopPointsTimer[stopPoint.time] = i;

        if (stopPoint.stopPoint) {
          let
            $stopPoint = $('.' + stopPoint.stopPoint),
            stopPointWidth = $stopPoint.outerWidth(),
            offsetLeft = curleft + (progressHolder.outerWidth() / duration * stopPoint.time) - (stopPointWidth / 2),
            styles = {
              display: 'block',
              bottom: '10px',
              left: offsetLeft + 'px'
            };

          $stopPoint.on('click', function() {
            this.goToStopPoint(stopPoint);
          }.bind(this));

          $stopPoint.css(styles);
        }
      }
    }
  }.bind(this), 50);
}

KPlayer.prototype.goToStopPoint = function(stopPoint) {
  this.stopPlayback();
  this._showEndpoint(stopPoint);
  this.activeStopPoint = stopPoint;
}

KPlayer.prototype.setControls = function(controlPanel) {
  let
    self = this,
    controls = $('.' + controlPanel).first();

  this.$playPause = $('.playPause', controls).first();
  this.$mute = $('.muteButton', controls).first();
  this.$progressBar = $('.progress', controls).first();
  this.$fullProgressBar = $('.background', controls).first();
  this.$timeLine = $('.timelineContainer', controls).first();

  // EVENTS
  this.$playPause.on('click', function() {
    this.isPlaying
    ? this.stopPlayback()
    : this.startPlayback();
  }.bind(this));

  this.$mute.on('click', function() {
    this.mute();
  }.bind(this));

  this.$timeLine.on('mousedown', function(evt) {
    self.pause();
    self.setPlayProgress(evt.pageX);

    document.onmousemove = function(evt) {
      self.setPlayProgress(evt.pageX);
    }

    $(this).one('mouseup', function(evt) {
      document.onmouseup = null;
      document.onmousemove = null;

      self._resetEndpoint();
      self.isPlayback && self.play();
    })
  });
}

KPlayer.prototype._showEndpoint = function(endpoint) {
  this._resetEndpoint();
  $('.video').hide();
  $('.' + endpoint.endPoint).show();

  this.pause();
  this.setPlayProgress(endpoint.time + 0.1, true);

  if (endpoint.timeout && this.isPlayback) {
    this.stopPointTimeout = setTimeout(function() { this.play() }.bind(this), endpoint.timeout);
  }
}
