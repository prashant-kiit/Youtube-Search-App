function handleAPILoaded() {
  $('#key').attr('disabled', false);
  $('#save-button').attr('disabled', false);
}

class Secret {
  constructor() {
    let key = null;
    this.setKey = (key1) => {
      key = key1;
    };
    this.getKey = () => key;
  }
}

let secret = new Secret();
// let key;

function saveApi() {
  if (document.getElementById('save-button').innerHTML == 'Unsave Api Key') {
    // key = null;
    secret.setKey(null);
    document.getElementById('key').value = '';
    document.getElementById('save-button').innerHTML = 'Save Api';
    document.getElementById('error').innerText = '';
    document.getElementById('search-container').innerText = '';
    if (document.getElementById("watch-subcontainer")) {
      document.getElementById("watch-subcontainer").remove();
    }
  }
  else {
    // key = document.getElementById('key').value;
    secret.setKey(document.getElementById('key').value);
    document.getElementById('key').value = 'Key is saved successfully. Start Searching!'
    document.getElementById('save-button').innerHTML = 'Unsave Api Key'
    console.log(secret.getKey());
    $('#query').attr('disabled', false);
    $('#search-button').attr('disabled', false);
  }
}

function search() {
  document.getElementById('error').innerText = '';
  document.getElementById('search-container').innerText = '';
  if (document.getElementById("watch-subcontainer")) {
    document.getElementById("watch-subcontainer").remove();
  }
  var q = document.getElementById('query').value;
  console.log(secret.getKey());
  var request = gapi.client.youtube.search.list({
    key: secret.getKey(), 
    q: q,
    part: 'id, snippet',
    type: 'video',
    location: '37.7749, -122.4194',
    locationRadius: '1000km',
    relevanceLanguage: 'en',
    topicId: '/m/07c1v',
    order: 'rating',
    safeSearch: 'strict',
    publishedAfter: '2021-01-01T00:00:00.000Z',
    maxResults: 10
  });
  request.execute(function (response) {
    if (response.error) {
      document.getElementById("error").innerHTML = 'Error code: ' + response.error.code + ', Error Message: ' + response.error.message;
    }
    // document.getElementById('test').innerHTML = JSON.stringify(response.result.items);
    for (const item of response.result.items) {
      var videoId = item.id.videoId;
      var title = item.snippet.title;
      var description = item.snippet.description;
      var thumbnailUrl = item.snippet.thumbnails.default.url;
      var thumbnailWidth = item.snippet.thumbnails.default.width;
      var thumbnailHeight = item.snippet.thumbnails.default.height;
      // const markup = `<img src="${thumbnailUrl}" alt="Thumbnail not displayed" width="${thumbnailWidth}" height="${thumbnailHeight}"> <br> <br> <a href=https://www.youtube.com/watch?v=${videoId}>${title}</a> <br> <br> ${description} <br> <br> 
      const markup = `
      <img src="${thumbnailUrl}" alt="Thumbnail not displayed" width="${thumbnailWidth}" height="${thumbnailHeight}"> 
      <br> <br> 
      <div class="details">
      ${title} 
      <br>
      ${description}
      </div> 
      <br>
      <input type="text" value="${videoId}" id="${videoId}"> 
      <button class = "watch-button" id="watch-button" onclick="watch('${videoId}')">Watch</button>
      <br>
      <br> 
      <hr>`;
      document.getElementById('search-container').insertAdjacentHTML('beforeend', markup);
    }
  });
}

function watch(videoId) {
  event.preventDefault();
  if (document.getElementById("watch-subcontainer")) {
    document.getElementById("watch-subcontainer").remove();
  }
  var div1 = document.createElement('div');
  div1.id = 'watch-subcontainer';
  div1.innerHTML = 'This is a new div for watch-subcontainer';
  document.getElementById('watch-container').appendChild(div1);
  var videoId = document.getElementById(`${videoId}`).value;
  window.scrollBy(0, 1000000000000);
  // console.log(videoId);
  return new YT.Player('watch-subcontainer', {
    height: '390',
    width: '640',
    videoId: videoId,
    events: {
      onReady: e => e.target.playVideo()
    }
  });
}
