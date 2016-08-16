(function() {
  var db, input, ul;

  databaseOpen()
    .then(function() {
      input = document.querySelector('input');
      ul = document.querySelector('ul');
      document.body.addEventListener('submit', onSubmit);
      document.body.addEventListener('click', onClick);
    })
    .then(refreshView);

  function databaseOpen() {
    return new Promise(function(resolve, reject) {
      var version = 1;
      var request = indexedDB.open('bookmarks', version);

      // Run migrations if necessary
      request.onupgradeneeded = function(e) {
        db = e.target.result;
        e.target.transaction.onerror = reject;
        db.createObjectStore('bookmark', { keyPath: '_id' });
      };

      request.onsuccess = function(e) {
        db = e.target.result;
        resolve();
      };
      request.onerror = reject;
    });
  }

  function onSubmit(e) {
    e.preventDefault();
    var todo = { text: input.value, _id: String(Date.now()) };
    databaseTodosPut(todo)
      .then(function() {
        input.value = '';
      })
      .then(refreshView);
  }

  function onClick(e) {

    // We'll assume that any element with an ID
    // attribute is a to-do item. Don't try this at home!
    e.preventDefault();
    if (e.target.hasAttribute('id')) {
      databaseTodosGetById(e.target.getAttribute('id'))
        .then(function(bookmark) {
          return databaseTodosDelete(bookmark);
        })
        .then(refreshView);
    }
  }

  function databaseBookmarksPut(bookmark) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['bookmark'], 'readwrite');
      var store = transaction.objectStore('bookmark');
      var request = store.put(bookmark);
      transaction.oncomplete = resolve;
      request.onerror = reject;
    });
  }

  function databaseBookmarksGet() {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['bookmark'], 'readonly');
      var store = transaction.objectStore('bookmark');

      // Get everything in the store
      var keyRange = IDBKeyRange.lowerBound(0);
      var cursorRequest = store.openCursor(keyRange);

      // This fires once per row in the store, so for simplicity collect the data
      // in an array (data) and send it pass it in the resolve call in one go
      var data = [];
      cursorRequest.onsuccess = function(e) {
        var result = e.target.result;

        // If there's data, add it to array
        if (result) {
          data.push(result.value);
          result.continue();

        // Reach the end of the data
        } else {
          resolve(data);
        }
      };
    });
  }

  function databaseBookmarksGetById(id) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['bookmark'], 'readwrite');
      var store = transaction.objectStore('bookmark');
      var request = store.get(id);
      request.onsuccess = function(e) {
        var result = e.target.result;
        resolve(result);
      };
      request.onerror = reject;
    });
  }

  function databaseBookmarksDelete(bookmark) {
    return new Promise(function(resolve, reject) {
      var transaction = db.transaction(['bookmark'], 'readwrite');
      var store = transaction.objectStore('bookmark');
      var request = store.delete(bookmark._id);
      transaction.oncomplete = resolve;
      request.onerror = reject;
    });
  }

  function refreshView() {
    return databaseBookmarksGet().then(renderAllBookmarks);
  }

  function renderAllBookmarks(bookmarks) {
    var html = '';
    bookmarks.forEach(function(bookmark) {
      html += todoToHtml(bookmark);
    });
    ul.innerHTML = html;
  }

  function todoToHtml(bookmark) {
    return '<li><button id="'+bookmark._id+'">delete</button>'+bookmark.text+'</li>';
  }




}());
