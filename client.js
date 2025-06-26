TrelloPowerUp.initialize({
  'card-buttons': function (t, options) {
    return [{
      icon: 'https://cdn-icons-png.flaticon.com/512/1828/1828911.png',
      text: 'Assign Pre-Listing Tasks',
      callback: function (t) {
        return t.popup({
          title: 'Power-Up Connected!',
          url: 'index.html'
        });
      }
    }];
  }
});