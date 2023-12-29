function loadAPIClientInterfaces() {
    gapi.client.load('youtube', 'v3', function () {
        handleAPILoaded();
    });
}
