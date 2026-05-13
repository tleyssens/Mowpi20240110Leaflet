"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// class/StateManager.js
var StateManager =
/*#__PURE__*/
function () {
  function StateManager() {
    var initialState = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, StateManager);

    this.state = JSON.parse(JSON.stringify(initialState));
    this.io = null;
  }

  _createClass(StateManager, [{
    key: "set",
    value: function set(key, value) {
      var keys = key.split('.');
      var obj = this.state;

      for (var i = 0; i < keys.length - 1; i++) {
        if (obj[keys[i]] === undefined) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }

      obj[keys[keys.length - 1]] = value;
      this.emitChange();
      return value;
    }
  }, {
    key: "get",
    value: function get(key) {
      if (!key) return this.state;
      var keys = key.split('.');
      var obj = this.state;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var k = _step.value;
          if (obj === undefined || obj === null) return undefined;
          obj = obj[k];
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      console.log("StateManager.get('".concat(key, "') =>"), obj);
      return obj;
    }
  }, {
    key: "setIO",
    value: function setIO(ioInstance) {
      this.io = ioInstance;
    }
  }, {
    key: "emitChange",
    value: function emitChange() {
      if (this.io) {
        var fullState = this.state;
        var guiState = this.get('GUI') || {}; // Belangrijk voor jouw client code

        this.io.sockets.emit('s', fullState); // <--- dit verwacht de map

        this.io.sockets.emit('state', guiState);
        this.io.sockets.emit('update', fullState);
      }
    }
  }]);

  return StateManager;
}();

module.exports = StateManager;