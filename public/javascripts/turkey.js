(function() {
  let player = new KPlayer('video-player');

  player.setControls('video-controls');
  player.setStopPoints([
    {
      time: 2,
      stopPoint: 'stopPoint_1',
      endPoint: 'endPoint_1',
      timeout: 7000
    },
    {
      time: 30.9,
      stopPoint: 'stopPoint_2',
      endPoint: 'endPoint_2',
      timeout: 5000
    },
    {
      time: 45,
      stopPoint: 'stopPoint_3',
      endPoint: 'endPoint_3',
      timeout: 3000
    },
    {
      time: 60.3,
      stopPoint: 'stopPoint_4',
      endPoint: 'endPoint_4',
      timeout: 1000
    }
  ]);

  $('.endpointLink_play').on('click', function() {
    player.startPlayback();
  });

  $('.endpointLink_stop').on('click', function() {
    player.stopPlayback();
  });

  $('.endpointLink_next').on('click', function() {
    player.nextStopPoint();
  });

  $('.endpointLink_prev').on('click', function() {
    player.prevStopPoint();
  });
})();