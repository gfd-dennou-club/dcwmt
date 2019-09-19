L.GridLayer.NumData = L.TileLayer.extend({
  initialize: function(url, options){
    this._url = url;
    L.Util.setOptions(this, options);
  },
  _addTile: function (coords, container) {
    //console.log("addTile");
		var tilePos = this._getTilePos(coords),
		    key = this._tileCoordsToKey(coords);

		var tile = this.createTile(this._wrapCoords(coords), L.Util.bind(this._tileReady, this, coords));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			requestAnimFrame(bind(this._tileReady, this, coords, null, tile));
		}

		L.DomUtil.setPosition(tile, tilePos);
    //console.log("coords : "+coords+",   key : "+key)
		// save tile in cache
		this._tiles[key] = {
			el: tile,
			coords: coords,
			current: true
		};

		container.appendChild(tile);
		// @event tileloadstart: TileEvent
		// Fired when a tile is requested and starts loading.
		this.fire('tileloadstart', {
			tile: tile,
			coords: coords
		});
	},
  _removeTile: function (key) {
    //console.log(_removeTile.caller.name);
		var tile = this._tiles[key];
		if (!tile) {
      console.log("cannot find this._tiles");
      return;
     }

		// Cancels any pending http requests associated with the tile
		// unless we're on Android's stock browser,
		// see https://github.com/Leaflet/Leaflet/issues/137
  //console.log("tileRemove");
		if (!L.Browser.androidStock) {
      //console.log("!androidStock");
			tile.el.setAttribute('src', L.Util.emptyImageUrl);
		}
		L.DomUtil.remove(tile.el);
  //  console.log(tile.el);
		delete this._tiles[key];
    //console.log(this._tiles[key]);

		// @event tileunload: TileEvent
		// Fired when a tile is removed (e.g. when a tile goes off the screen).
		this.fire('tileunload', {
			tile: tile.el,
			coords: this._keyToTileCoords(key)
		});
	},
  _onTileRemove: function (e) {
		e.tile.onload = null;
    console.log("onTileRemove");
	},
  _tileReady: function (coords, err, tile) {
  //console.log(coords);
		if (!this._map) {
      console.log("!this._map");
      return;
    }

		if (err) {
			// @event tileerror: TileErrorEvent
			// Fired when there is an error loading a tile.
			this.fire('tileerror', {
				error: err,
				tile: tile,
				coords: coords
			});
		}

		var key = this._tileCoordsToKey(coords);

		tile = this._tiles[key];
    //console.log(tile);
		if (!tile) {
          //

          //console.log("<<can not load>>  coords : "+coords+",   key : "+key);
          //console.log(tile);
      return;
    }

		tile.loaded = +new Date();
		if (this._map._fadeAnimated) {
			L.DomUtil.setOpacity(tile.el, 0);
			L.Util.cancelAnimFrame(this._fadeFrame);
			this._fadeFrame = L.Util.requestAnimFrame(this._updateOpacity, this);
		} else {
			tile.active = true;
			this._pruneTiles();
		}

		if (!err) {
			L.DomUtil.addClass(tile.el, 'leaflet-tile-loaded');

			// @event tileload: TileEvent
			// Fired when a tile loads.
			this.fire('tileload', {
				tile: tile.el,
				coords: coords
			});
      console.log(tile.el);
		}

		if (this._noTilesToLoad()) {
			this._loading = false;
			// @event load: Event
			// Fired when the grid layer loaded all visible tiles.
			this.fire('load');

			if (L.Browser.ielt9 || !this._map._fadeAnimated) {
				requestAnimFrame(this._pruneTiles, this);
			} else {
				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
				// to trigger a pruning.
				setTimeout(L.Util.bind(this._pruneTiles, this), 250);
			}
		}
	},

  /*タイル生成*/
  createTile: function (coords,done) {

/*
    var tile = document.createElement('img');
		L.DomEvent.on(tile, 'load', L.Util.bind(this._tileOnLoad, this, done, tile));
		L.DomEvent.on(tile, 'error', L.Util.bind(this._tileOnError, this, done, tile));
		if (this.options.crossOrigin) {
			tile.crossOrigin = '';
		}

		// Alt tag is set to empty string to keep screen readers from reading URL and for compliance reasons
		// http://www.w3.org/TR/WCAG20-TECHS/H67

		tile.alt = '';


		// Set role="presentation" to force screen readers to ignore this
		// https://www.w3.org/TR/wai-aria/roles#textalternativecomputation

		tile.setAttribute('role', 'presentation');

		tile.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    return tile;
*/

    var canvas_tile = document.createElement('canvas');
    canvas_tile.setAttribute('width', 240); //canvasの大きさ定義
    canvas_tile.setAttribute('height', 240);
    var ctx = canvas_tile.getContext('2d');
    var img = new Image();
    L.DomEvent.on(img, 'load', L.Util.bind(this._tileOnLoad, this, done, img));
		L.DomEvent.on(img, 'error', L.Util.bind(this._tileOnError, this, done, img));
		if (this.options.crossOrigin) {
			img.crossOrigin = '';
		}
		img.alt = '';
		img.setAttribute('role', 'presentation');
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    ctx.drawImage(img, 0, 0);//canvasオブジェクトの左上から画像を貼り付け
    return canvas_tile;


  },
  //ズーム時に視点が変わった時呼び出
  _setView: function (center, zoom, noPrune, noUpdate) {
   //console.log("setView  noPrune : "+noPrune);
		var tileZoom = this._clampZoom(Math.round(zoom));
		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
			tileZoom = undefined;
		}

		var tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

		if (!noUpdate || tileZoomChanged) {

			this._tileZoom = tileZoom;

			if (this._abortLoading) {
				this._abortLoading();
			}

			this._updateLevels();
			this._resetGrid();

			if (tileZoom !== undefined) {
				this._update(center);
			}

			if (!noPrune) {
        //alert("sss");
				this._pruneTiles();
			}

			// Flag to prevent _updateOpacity from pruning tiles during
			// a zoom anim or a pinch gesture
			this._noPrune = !!noPrune;
		}

		this._setZoomTransforms(center, zoom);
  },

  /*スクロール*/
  /*スクロールの1コマごとに呼び出し*/
  _onMoveEnd: function () {
    //console.log("_onMoveEnd");
		if (!this._map || this._map._animatingZoom) {
      console.log("_onMoveEnd breake");
      return;
    }

		this._update();
	},
  /*再描画*/
  /*用意されてるだけで明示的に記述しないと実行されない*/
  redraw: function () {
    console.log("redraw");
		if (this._map) {
			this._removeAllTiles();
			this._update();
		}
		return this;
	},
  /*レイヤー追加*/
  /*明示的に呼び出さなければ初回のみ(mapにaddした時)実行*/
  onAdd: function () {
    console.log("_onAdd");
		this._initContainer();

		this._levels = {};
		this._tiles = {};
    //alert("dff");

		this._resetView();
		this._update();
	},
  _update: function (center) {
    //console.log(this._tiles);
		var map = this._map;
		if (!map) { return; }
		var zoom = this._clampZoom(map.getZoom());

		if (center === undefined) { center = map.getCenter(); }
		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

		var pixelBounds = this._getTiledPixelBounds(center),
		    tileRange = this._pxBoundsToTileRange(pixelBounds),
		    tileCenter = tileRange.getCenter(),
		    queue = [],
		    margin = this.options.keepBuffer,
		    noPruneRange = new L.Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
		                              tileRange.getTopRight().add([margin, -margin]));

		// Sanity check: panic if the tile range contains Infinity somewhere.
		if (!(isFinite(tileRange.min.x) &&
		      isFinite(tileRange.min.y) &&
		      isFinite(tileRange.max.x) &&
		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

		for (var key in this._tiles) {
			var c = this._tiles[key].coords;
      //console.log("key: "+key);
      //console.log(c.z+" !== "+this._tileZoom);
			if (c.z !== this._tileZoom || !noPruneRange.contains(new L.Point(c.x, c.y))) {
        //console.log("this._tiles.current is false");
				this._tiles[key].current = false;
			}
		}

		// _update just loads more tiles. If the tile zoom level differs too much
		// from the map's, let _setView reset levels and prune old tiles.
		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

		// create a queue of coordinates to load tiles from
		for (var j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (var i = tileRange.min.x; i <= tileRange.max.x; i++) {
				var coords = new L.Point(i, j);
				coords.z = this._tileZoom;

				if (!this._isValidTile(coords)) { continue; }

				var tile = this._tiles[this._tileCoordsToKey(coords)];
				if (tile) {
					tile.current = true;
				} else {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(tileCenter) - b.distanceTo(tileCenter);
		});

		if (queue.length !== 0) {
			// if it's the first batch of tiles to load
			if (!this._loading) {
				this._loading = true;
				// @event loading: Event
				// Fired when the grid layer starts loading tiles.
				this.fire('loading');
			}

			// create DOM fragment to append tiles in one batch
			var fragment = document.createDocumentFragment();

			for (i = 0; i < queue.length; i++) {
				this._addTile(queue[i], fragment);
			}

			this._level.el.appendChild(fragment);
		}
	},
  _animateZoom: function (e) {
    //console.log("animzoom");
		this._setView(e.center, e.zoom, true, e.noUpdate);
	},
  _removeTilesAtZoom: function (zoom) {
		for (var key in this._tiles) {
			if (this._tiles[key].coords.z !== zoom) {
				continue;
			}
      console.log("removeAtZoom");
			this._removeTile(key);
		}
	},

	_removeAllTiles: function () {
    console.log("removeAllTile");
		for (var key in this._tiles) {
			this._removeTile(key);
		}
	},
  _pruneTiles: function () {
		if (!this._map) {
			return;
		}

		var key, tile;

		var zoom = this._map.getZoom();
		if (zoom > this.options.maxZoom ||
			zoom < this.options.minZoom) {
			this._removeAllTiles();
			return;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			tile.retain = tile.current;
		}

		for (key in this._tiles) {
			tile = this._tiles[key];
			if (tile.current && !tile.active) {
				var coords = tile.coords;
				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
				}
			}
		}

		for (key in this._tiles) {
			if (!this._tiles[key].retain) {
        //console.log("paneTiles");
				this._removeTile(key);
			}
		}
	},
  /*引数 : coords , 戻り値 : canvasオブジェクト*/
  getCanvasElement: function(coords){
    var key = this._tileCoordsToKey(coords);
    //console.log("coords : "+coords);
    //console.log("key : "+key);
    try{
      return this._tiles[key].el;
    }catch(e){
      //console.log("key : "+key);
    }
  }
});

L.gridLayer.numData = function(url, opts) {
  return new L.GridLayer.NumData(url, opts);
};
