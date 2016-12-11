var playList = ".songs",
	playListsContainer = ".content",
	playBtn = "#playBtn",
	pauseBtn = "#playBtn.nowplaying",
	songDuration = ".song-length",
	songCurrentTime = ".current-time",
	playerSlider = "#slider",
	playerSliderProgress = ".sliderBg",
	starBtn = ".saveit",
	downloadBtn = ".downloadit",
	currentLoopBtn = ".loop-btn",
	currentStarBtn = ".star-btn",
	currentDownloadBtn = ".cloud-btn",
	starredList = ".starred-list",
	resultsList = ".results-list",
	importLocalFiles = "input.getSongs",
	importDefaultArt = "images/albums/albumart-blank.jpg";
String.prototype.toMMSS = function() {
	var t = parseInt(this, 10),
		e = Math.floor(t / 60),
		a = t - 60 * e;
	10 > a && (a = "0" + a);
	var n = e + ":" + a;
	return n
};
var sP = {
	audio: new Audio,
	play: function(t, e) {
		if (t) {
			if (t && (sP.audio.src = $(t).attr("data-song"), sP.audio.load(), sP.audio.play(), $(playList + " li").removeClass("nowplaying wasplaying"), $(t).addClass("nowplaying"), $(currentLoopBtn).removeClass("islooped"), $(t).find(starBtn + ".isstarred").length ? $(currentStarBtn).addClass("isstarred") : $(t).find(starBtn + ".isstarred").length || $(currentStarBtn).removeClass("isstarred"), $(t).find(downloadBtn + ".isdownloaded").length ? $(currentDownloadBtn).addClass("isdownloaded") : $(t).find(downloadBtn + ".isdownloaded").length || $(currentDownloadBtn).removeClass("isdownloaded"), sP.audio.duration != sP.audio.duration && $(songDuration).text("0:00"), $(t).not("[id^=sLID]").attr("id"))) {
				var a = $(t).attr("id");
				localStorage.setItem("lastPlayedID", a)
			}
		} else sP.audio.play(), $(playList + " li.wasplaying").removeClass("wasplaying");
		e && sP.audio.addEventListener("timeupdate", function(t) {
			var e = parseInt(sP.audio.currentTime, 10).toString(),
				a = e.toMMSS();
			$(".channel-time").html(a)
		}), $(playBtn).addClass("nowplaying")
	},
	pause: function() {
		sP.audio.pause(), $(pauseBtn).removeClass("nowplaying"), $(playList + " li.nowplaying").addClass("wasplaying")
	},
	next: function() {
		if (!$(playList + " li.nowplaying:not(:last-child)").length) return !1;
		var t = $(playList + " li.nowplaying").next();
		sP.play(t)
	},
	prev: function() {
		if (!$(playList + " li.nowplaying:not(:first-child)").length) return !1;
		var t = $(playList + " li.nowplaying").prev();
		sP.play(t)
	},
	star: function(t) {
		var e = "";
		t ? t && (e = t) : e = playList + " li.nowplaying";
		var a = $(e).attr("id"),
			n = $("#" + a).clone();
		$(n).attr({
			"data-id": a,
			id: ""
		}), $(starredList + " ul").append(n), $("#nocontent").addClass("passive"), $(e).hasClass("nowplaying") && $(currentStarBtn).addClass("isstarred"), $(starredList + " li " + starBtn).addClass("isstarred"), $(e).find(starBtn).addClass("isstarred");
		var i = $(playList + " li[id] " + starBtn + ".isstarred").parents("li").map(function() {
			return this.id
		}).get().join(",");
		localStorage.setItem("starredSongs", i)
	},
	unstar: function(t) {
		var e = "";
		t ? t && (e = t) : e = playList + " li.nowplaying";
		var a = $(e).attr("id") || $(e).attr("data-id");
		$(starredList + " li[data-id=" + a + "]").remove(), $("#" + a).find(starBtn).removeClass("isstarred"), 0 == $(starredList + " li").length && $("#nocontent").removeClass("passive"), $(e).hasClass("nowplaying") && $(currentStarBtn).removeClass("isstarred"), $(e).find(starBtn).removeClass("isstarred");
		var n = $(playList + " li[id] " + starBtn + ".isstarred").parents("li").map(function() {
			return this.id
		}).get().join(",");
		localStorage.setItem("starredSongs", n)
	},
	search: function(t) {
		var e = playList + ":not(" + starredList + ") li[id]";
		$(e).each(function() {
			if ($(this).text().search(new RegExp(t, "i")) < 0) {
				var e = $(this).attr("id");
				$(resultsList + " li[data-id=" + e + "]").remove()
			} else {
				var e = $(this).attr("id"),
					a = $(this).clone(),
					n = {};
				$(a).attr({
					"data-id": e,
					id: ""
				}), $(resultsList + " ul").append(a), $(resultsList + " li").each(function() {
					var t = $(this).attr("data-id");
					n[t] ? $(this).remove() : n[t] = "true"
				})
			}
		}), 0 == $(resultsList + " li").length ? $("#noresults").show() : $(resultsList + " li").length > 0 && $("#noresults").hide()
	},
	"import": function(t, e) {
		ID3v2.parseFile(t[e], function(a) {
			var n;
			window.createObjectURL ? n = window.createObjectURL(t[e]) : window.createBlobURL ? n = window.createBlobURL(t[e]) : window.URL && window.URL.createObjectURL ? n = window.URL.createObjectURL(t[e]) : window.webkitURL && window.webkitURL.createObjectURL && (n = window.webkitURL.createObjectURL(t[e]));
			var i = "sLID" + e,
				r = importDefaultArt || "";
			if (a.pictures.length > 0 && a.pictures[0].dataURL && "" == a.pictures[0].Description) return r = a.pictures[0].dataURL, sPimportBeta(t[e], a, n, i, r);
			if (!a.Album || !a.Artist) return sPimportBeta(t[e], a, n, i, r);
			var o = a.Album.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""),
				s = a.Artist.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ""),
				l = "https://api.spotify.com/v1/search?q=album:" + o + "%20artist:" + s + "&type=album",
				d = l.replace(/ /g, "%20");
			$.getJSON(d, function(o) {
				$.each(o, function(o, s) {
					return s.items[0] && (r = s.items[0].images[1].url), sPimportBeta(t[e], a, n, i, r)
				})
			}).fail(function() {
				return sPimportBeta(t[e], a, n, i, r)
			})
		})
	},
	share: function(t) {
		var e = window.location.href,
			a = e.indexOf("?share="),
			n = e.substr(a + 7);
		return a > -1 && $("#" + n).length ? t(n) : void 0
	},
	lastPlayed: function(t) {
		{
			var e = localStorage.getItem("lastPlayedID"),
				a = window.location.href,
				n = a.indexOf("?share=");
			a.substr(n + 7)
		}
		return e && -1 == n ? t(e) : void 0
	},
	clear: function(t) {
		"starredListStorage" == t ? localStorage.removeItem("starredSongs") : "importStorage" == t && (localforage.removeItem("selectedFiles"), $(importLocalFiles).wrap("<form>").closest("form").get(0).reset(), $(importLocalFiles).unwrap())
	}
};
$("#playerJS").on("click", playBtn, function() {
	sP.play()
}), $("#playerJS").on("click", pauseBtn, function() {
	sP.pause()
}), $(playListsContainer).on("click", playList + " li.nowplaying.wasplaying", function() {
	sP.play()
}), $(playListsContainer).on("click", playList + " li.nowplaying:not(.wasplaying)", function() {
	sP.pause()
}), $(playListsContainer).on("click", playList + " li:not(.nowplaying):not(.wasplaying)", function() {
	sP.play(this)
}), $(".next-btn").click(sP.next), $(".prev-btn").click(sP.prev), sP.audio.addEventListener("loadedmetadata", function(t) {
	var e = parseInt(sP.audio.duration, 10).toString(),
		a = e.toMMSS(),
		n = parseInt(sP.audio.currentTime, 10).toString(),
		i = n.toMMSS();
	songDuration && $(songDuration).text(sP.audio.duration != sP.audio.duration ? "0:00" : a), songCurrentTime && $(songCurrentTime).text(i)
}), $(playerSlider).on("change", function() {
	sP.audio.currentTime = $(playerSlider).val(), sP.audio.play(), $(playBtn).addClass("nowplaying"), $(playList + " li.wasplaying").removeClass("wasplaying")
}), sP.audio.addEventListener("timeupdate", function(t) {
	$(playerSlider).attr("max", sP.audio.duration).attr("value", sP.audio.currentTime);
	var e = parseInt(sP.audio.currentTime, 10).toString(),
		a = e.toMMSS(),
		n = 100 * sP.audio.currentTime / sP.audio.duration + "%";
	$(".sliderBg").css("width", n), $(songCurrentTime).text(a)
}), $(currentLoopBtn).click(function() {
	function t() {
		return $(currentLoopBtn + ".islooped").length ? (sP.audio.play(), playerSlider && $(playerSlider).val(sP.audio.currentTime), $(playBtn).addClass("nowplaying"), $(playList + " li.nowplaying").removeClass("wasplaying"), void 0) : !1
	}
	$(this).toggleClass("islooped"), sP.audio.addEventListener("ended", t)
}), sP.audio.addEventListener("ended", function() {
	!currentLoopBtn && $(playList + " li.nowplaying:not(:last-child)").length ? sP.next() : currentLoopBtn && $(playList + " li.nowplaying:not(:last-child)").length && $(currentLoopBtn + ":not(.islooped)").length ? sP.next() : sP.pause()
}), $(currentStarBtn).click(function(t) {
	$(this).hasClass("isstarred") ? sP.unstar() : sP.star()
}), $(playListsContainer).on("click", starBtn, function(t) {
	t.stopPropagation(), t.preventDefault();
	var e = $(this).parent();
	$(this).hasClass("isstarred") ? sP.unstar(e) : sP.star(e)
}), $(currentDownloadBtn).click(function(t) {
	var e = $(playList + " li.nowplaying " + downloadBtn),
		a = e.children(),
		n = a.attr("href");
	$(this).toggleClass("isdownloaded"), e.toggleClass("isdownloaded"), $(this).children().attr("href", n)
}), $(playListsContainer).on("click", downloadBtn, function(t) {
	t.stopPropagation(), $(this).toggleClass("isdownloaded");
	var e = $(this).parent();
	$(this).hasClass("isdownloaded") ? currentDownloadBtn && $(e).hasClass("nowplaying") && $(currentDownloadBtn).addClass("isdownloaded") : currentDownloadBtn && $(e).hasClass("nowplaying") && $(currentDownloadBtn).removeClass("isdownloaded")
}), $(".share-btn").click(function() {
	var t = $(playList + " li.nowplaying").attr("id"),
		e = window.location.href.split("?share=")[0],
		a = e + "?share=" + t;
	$(".share-link").text(a)
}), $("#search").keyup(function() {
	var t = $(this).val();
	sP.search(t)
});
var fileSlice = function(t, e, a) {
		return t.mozSlice ? t.mozSlice(e, e + a) : t.webkitSlice ? t.webkitSlice(e, e + a) : t.slice ? t.slice(e, a) : void 0
	},
	ID3v2 = {
		parseStream: function(t, e) {
			function a(e, a) {
				t(e, a, y)
			}

			function n(t) {
				for (var e, a, n, i, r, o, s, l = "", d = 0, c = t.length, u = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="; c > d;) e = t.charCodeAt(d++), a = t.charCodeAt(d++), n = t.charCodeAt(d++), i = e >> 2, r = (3 & e) << 4 | a >> 4, o = (15 & a) << 2 | n >> 6, s = 63 & n, isNaN(a) ? o = s = 64 : isNaN(n) && (s = 64), l = l + u.charAt(i) + u.charAt(r) + u.charAt(o) + u.charAt(s);
				return l
			}

			function i(t) {
				var e = parseInt(c(t)),
					a = Math.floor(e / 1e3),
					n = Math.floor(a / 60),
					i = Math.floor(n / 60),
					r = Math.floor(i / 24);
				return {
					milliseconds: e % 1e3,
					seconds: a % 60,
					minutes: n % 60,
					hours: i % 24,
					days: r
				}
			}

			function r(t) {
				var e = t.toString(2);
				return new Array(8 - e.length + 1).join("0") + e
			}

			function o(t) {
				if (4 == t.length)
					if (h.revision > 3) {
						var e = t[0] << 21;
						e += t[1] << 14, e += t[2] << 7, e += t[3]
					} else {
						var e = t[0] << 24;
						e += t[1] << 16, e += t[2] << 8, e += t[3]
					}
				else {
					var e = t[0] << 16;
					e += t[1] << 8, e += t[2]
				}
				return e
			}

			function s(t) {
				t.charCodeAt(0);
				t = t.substr(1);
				var e = t.indexOf("\x00"),
					a = t.substr(0, e);
				t = t.substr(e + 1);
				var i = t.charCodeAt(0),
					r = f[i.toString(16).toUpperCase()];
				t = t.substr(1);
				var o = t.indexOf("\x00"),
					s = t.substr(0, o);
				t = t.substr(o + 1);
				var l = t,
					d = l.split("").map(function(t) {
						return String.fromCharCode(255 & t.charCodeAt(0))
					}).join("");
				return {
					dataURL: "data:" + a + ";base64," + n(d),
					PictureType: r,
					Description: s,
					MimeType: a
				}
			}

			function l(t) {
				t.charCodeAt(0);
				t = t.substr(1);
				var e = t.substr(0, 3);
				t = t.substr(3);
				var a = t.charCodeAt(0),
					i = f[a.toString(16).toUpperCase()];
				t = t.substr(1);
				var r = t.indexOf("\x00"),
					o = t.substr(0, r);
				t = t.substr(r + 1);
				var s = t,
					l = s.split("").map(function(t) {
						return String.fromCharCode(255 & t.charCodeAt(0))
					}).join("");
				return {
					dataURL: "data:img/" + e + ";base64," + n(l),
					PictureType: i,
					Description: o,
					MimeType: MimeType
				}
			}

			function d() {
				h.revision < 3 ? a(3, function(t) {
					if (!/[A-Z0-9]{3}/.test(t)) return void e(h);
					var a = T[t.substr(0, 3)];
					p(t, a)
				}) : a(4, function(t) {
					return /[A-Z0-9]{4}/.test(t) ? void u(t) : void e(h)
				})
			}

			function c(t) {
				if (0 != t.indexOf("http://")) {
					{
						t.charCodeAt(0)
					}
					t = t.substr(1)
				}
				return t.replace(/[^A-Za-z0-9\(\)\{\}\[\]\!\@\#\$\%\^\&\* \/\"\'\;\>\<\?\,\~\`\.\n\t]/g, "")
			}

			function u(t) {
				a(4, function(e, n) {
					var i = o(n);
					a(2, function(e, n) {
						n = r(n[0]).concat(r(n[1])), a(i, function(e, a) {
							"function" == typeof v[t] ? v[t](i, e, a) : g[t] ? h[g[t]] = (h[g[t]] || "") + c(e) : h[t] = c(e), d()
						})
					})
				})
			}

			function p(t, e) {
				a(3, function(n, i) {
					var r = o(i);
					a(r, function(a, n) {
						"function" == typeof v[t] ? v[t](r, a, n) : "function" == typeof v[e] ? v[e](r, a, n) : g[e] ? h[g[e]] = (h[g[e]] || "") + c(a) : h[e] = c(a), d()
					})
				})
			}
			var f = {
					0: "Other",
					1: "32x32 pixels 'file icon' (PNG only)",
					2: "Other file icon",
					3: "Cover (front)",
					4: "Cover (back)",
					5: "Leaflet page",
					6: "Media (e.g. lable side of CD)",
					7: "Lead artist/lead performer/soloist",
					8: "Artist/performer",
					9: "Conductor",
					A: "Band/Orchestra",
					B: "Composer",
					C: "Lyricist/text writer",
					D: "Recording Location",
					E: "During recording",
					F: "During performance",
					10: "Movie/video screen capture",
					11: "A bright coloured fish",
					12: "Illustration",
					13: "Band/artist logotype",
					14: "Publisher/Studio logotype"
				},
				g = {
					AENC: "Audio encryption",
					APIC: "Attached picture",
					COMM: "Comments",
					COMR: "Commercial frame",
					ENCR: "Encryption method registration",
					EQUA: "Equalization",
					ETCO: "Event timing codes",
					GEOB: "General encapsulated object",
					GRID: "Group identification registration",
					IPLS: "Involved people list",
					LINK: "Linked information",
					MCDI: "Music CD identifier",
					MLLT: "MPEG location lookup table",
					OWNE: "Ownership frame",
					PRIV: "Private frame",
					PCNT: "Play counter",
					POPM: "Popularimeter",
					POSS: "Position synchronisation frame",
					RBUF: "Recommended buffer size",
					RVAD: "Relative volume adjustment",
					RVRB: "Reverb",
					SYLT: "Synchronized lyric/text",
					SYTC: "Synchronized tempo codes",
					TALB: "Album",
					TBPM: "BPM",
					TCOM: "Composer",
					TCON: "Genre",
					TCOP: "Copyright message",
					TDAT: "Date",
					TDLY: "Playlist delay",
					TENC: "Encoded by",
					TEXT: "Lyricist",
					TFLT: "File type",
					TIME: "Time",
					TIT1: "Content group description",
					TIT2: "Title",
					TIT3: "Subtitle",
					TKEY: "Initial key",
					TLAN: "Language(s)",
					TLEN: "Length",
					TMED: "Media type",
					TOAL: "Original album",
					TOFN: "Original filename",
					TOLY: "Original lyricist",
					TOPE: "Original artist",
					TORY: "Original release year",
					TOWN: "File owner",
					TPE1: "Artist",
					TPE2: "Band",
					TPE3: "Conductor",
					TPE4: "Interpreted, remixed, or otherwise modified by",
					TPOS: "Part of a set",
					TPUB: "Publisher",
					TRCK: "Track number",
					TRDA: "Recording dates",
					TRSN: "Internet radio station name",
					TRSO: "Internet radio station owner",
					TSIZ: "Size",
					TSRC: "ISRC (international standard recording code)",
					TSSE: "Software/Hardware and settings used for encoding",
					TYER: "Year",
					TXXX: "User defined text information frame",
					UFID: "Unique file identifier",
					USER: "Terms of use",
					USLT: "Unsychronized lyric/text transcription",
					WCOM: "Commercial information",
					WCOP: "Copyright/Legal information",
					WOAF: "Official audio file webpage",
					WOAR: "Official artist/performer webpage",
					WOAS: "Official audio source webpage",
					WORS: "Official internet radio station homepage",
					WPAY: "Payment",
					WPUB: "Publishers official webpage",
					WXXX: "User defined URL link frame"
				},
				T = {
					BUF: "RBUF",
					COM: "COMM",
					CRA: "AENC",
					EQU: "EQUA",
					ETC: "ETCO",
					GEO: "GEOB",
					MCI: "MCDI",
					MLL: "MLLT",
					PIC: "APIC",
					POP: "POPM",
					REV: "RVRB",
					RVA: "RVAD",
					SLT: "SYLT",
					STC: "SYTC",
					TAL: "TALB",
					TBP: "TBPM",
					TCM: "TCOM",
					TCO: "TCON",
					TCR: "TCOP",
					TDA: "TDAT",
					TDY: "TDLY",
					TEN: "TENC",
					TFT: "TFLT",
					TIM: "TIME",
					TKE: "TKEY",
					TLA: "TLAN",
					TLE: "TLEN",
					TMT: "TMED",
					TOA: "TOPE",
					TOF: "TOFN",
					TOL: "TOLY",
					TOR: "TORY",
					TOT: "TOAL",
					TP1: "TPE1",
					TP2: "TPE2",
					TP3: "TPE3",
					TP4: "TPE4",
					TPA: "TPOS",
					TPB: "TPUB",
					TRC: "TSRC",
					TRD: "TRDA",
					TRK: "TRCK",
					TSI: "TSIZ",
					TSS: "TSSE",
					TT1: "TIT1",
					TT2: "TIT2",
					TT3: "TIT3",
					TXT: "TEXT",
					TXX: "TXXX",
					TYE: "TYER",
					UFI: "UFID",
					ULT: "USLT",
					WAF: "WOAF",
					WAR: "WOAR",
					WAS: "WOAS",
					WCM: "WCOM",
					WCP: "WCOP",
					WPB: "WPB",
					WXX: "WXXX"
				},
				m = {
					0: "Blues",
					1: "Classic Rock",
					2: "Country",
					3: "Dance",
					4: "Disco",
					5: "Funk",
					6: "Grunge",
					7: "Hip-Hop",
					8: "Jazz",
					9: "Metal",
					10: "New Age",
					11: "Oldies",
					12: "Other",
					13: "Pop",
					14: "R&B",
					15: "Rap",
					16: "Reggae",
					17: "Rock",
					18: "Techno",
					19: "Industrial",
					20: "Alternative",
					21: "Ska",
					22: "Death Metal",
					23: "Pranks",
					24: "Soundtrack",
					25: "Euro-Techno",
					26: "Ambient",
					27: "Trip-Hop",
					28: "Vocal",
					29: "Jazz+Funk",
					30: "Fusion",
					31: "Trance",
					32: "Classical",
					33: "Instrumental",
					34: "Acid",
					35: "House",
					36: "Game",
					37: "Sound Clip",
					38: "Gospel",
					39: "Noise",
					40: "AlternRock",
					41: "Bass",
					42: "Soul",
					43: "Punk",
					44: "Space",
					45: "Meditative",
					46: "Instrumental Pop",
					47: "Instrumental Rock",
					48: "Ethnic",
					49: "Gothic",
					50: "Darkwave",
					51: "Techno-Industrial",
					52: "Electronic",
					53: "Pop-Folk",
					54: "Eurodance",
					55: "Dream",
					56: "Southern Rock",
					57: "Comedy",
					58: "Cult",
					59: "Gangsta",
					60: "Top 40",
					61: "Christian Rap",
					62: "Pop/Funk",
					63: "Jungle",
					64: "Native American",
					65: "Cabaret",
					66: "New Wave",
					67: "Psychadelic",
					68: "Rave",
					69: "Showtunes",
					70: "Trailer",
					71: "Lo-Fi",
					72: "Tribal",
					73: "Acid Punk",
					74: "Acid Jazz",
					75: "Polka",
					76: "Retro",
					77: "Musical",
					78: "Rock & Roll",
					79: "Hard Rock",
					80: "Folk",
					81: "Folk-Rock",
					82: "National Folk",
					83: "Swing",
					84: "Fast Fusion",
					85: "Bebob",
					86: "Latin",
					87: "Revival",
					88: "Celtic",
					89: "Bluegrass",
					90: "Avantgarde",
					91: "Gothic Rock",
					92: "Progressive Rock",
					93: "Psychedelic Rock",
					94: "Symphonic Rock",
					95: "Slow Rock",
					96: "Big Band",
					97: "Chorus",
					98: "Easy Listening",
					99: "Acoustic",
					100: "Humour",
					101: "Speech",
					102: "Chanson",
					103: "Opera",
					104: "Chamber Music",
					105: "Sonata",
					106: "Symphony",
					107: "Booty Bass",
					108: "Primus",
					109: "Porn Groove",
					110: "Satire",
					111: "Slow Jam",
					112: "Club",
					113: "Tango",
					114: "Samba",
					115: "Folklore",
					116: "Ballad",
					117: "Power Ballad",
					118: "Rhythmic Soul",
					119: "Freestyle",
					120: "Duet",
					121: "Punk Rock",
					122: "Drum Solo",
					123: "A capella",
					124: "Euro-House",
					125: "Dance Hall"
				},
				h = {
					pictures: []
				},
				y = 1 / 0,
				v = {
					APIC: function(t, e, a) {
						h.pictures.push(s(e))
					},
					PIC: function(t, e, a) {
						h.pictures.push(l(e))
					},
					TLEN: function(t, e, a) {
						h.Length = i(e)
					},
					TCON: function(t, e, a) {
						if (e = c(e), /\([0-9]+\)/.test(e)) var n = m[parseInt(e.replace(/[\(\)]/g, ""))];
						else var n = e;
						h.Genre = n
					}
				};
			return a(3, function(t) {
				return "ID3" != t ? (e(h), !1) : void a(2, function(t, e) {
					h.version = "ID3v2." + e[0] + "." + e[1], h.revision = e[0], a(1, function(t, e) {
						e = r(e[0]), a(4, function(t, e) {
							y = o(e), a(0, function() {}), d()
						})
					})
				})
			}), h
		},
		parseURL: function(t, e) {
			function a(t, e, a) {
				r = t, o = e, s = a, 0 == t && e("", [])
			}
			var n = new XMLHttpRequest;
			n.open("get", t, !0), n.overrideMimeType("text/plain; charset=x-user-defined");
			var i = 0,
				r = 0,
				o = function() {},
				s = 1 / 0,
				l = "";
			return function() {
				if (n.responseText && (l = n.responseText), n.responseText.length > s && n.abort(), l.length > i + r && r) {
					var t = l.substr(i, r),
						e = t.split("").map(function(t) {
							return 255 & t.charCodeAt(0)
						});
					if (i += r, r = 0, o(t, e) === !1) return void n.abort()
				}
				setTimeout(arguments.callee, 0)
			}(), n.send(null), [n, ID3v2.parseStream(a, e)]
		},
		parseFile: function(t, e) {
			function a(t, e, a) {
				r = t, o = e, s = a, 0 == t && e("", [])
			}
			var n = new FileReader,
				i = 0,
				r = 0,
				o = function() {},
				s = 1 / 0,
				l = "";
			return n.onload = function() {
					l = n.result
				},
				function() {
					if (l.length > i + r && r) {
						var t = l.substr(i, r),
							e = t.split("").map(function(t) {
								return 255 & t.charCodeAt(0)
							});
						if (i += r, r = 0, o(t, e) === !1) return
					}
					setTimeout(arguments.callee, 0)
				}(), n.readAsBinaryString(fileSlice(t, 0, 131072)), [n, ID3v2.parseStream(a, e)]
		}
	};
$(importLocalFiles).on("change", function() {
	var t = function(t) {
			var e = new Audio;
			return !(!e.canPlayType || !e.canPlayType(t).replace(/no/, ""))
		},
		e = this.files;
	if (e) {
		for (var a = [], n = t("audio/mpeg;"), i = t('audio/ogg; codecs="vorbis"'), r = t("audio/aac;"), o = t("audio/m4a;"), s = t("audio/mp4;"), l = 0; l < e.length; l++) {
			var d = e[l],
				c = d.webkitRelativePath || d.mozFullPath || d.urn || d.name; - 1 == c.indexOf(".AppleDouble") && (-1 != d.name.indexOf("mp3") && n && a.push(d), -1 == d.name.indexOf("ogg") && -1 == d.name.indexOf("oga") || !i || a.push(d), -1 != d.name.indexOf("aac") && r && a.push(d), -1 != d.name.indexOf("m4a") && o && a.push(d), -1 != d.name.indexOf("mp4") && s && a.push(d))
		}
		localforage.setItem("selectedFiles", a)
	}
	if (a.length)
		for (var l = 0; l < a.length; l++) sP["import"](a, l)
}), localStorage.getItem("starredSongs") && ! function() {
	var t = localStorage.getItem("starredSongs"),
		e = t.split(",");
	$.each(e, function(t, a) {
		var n = "#" + e[t];
		sP.star(n)
	})
}(), localforage.getItem("selectedFiles", function(t, e) {
	if (e)
		for (var a = 0; a < e.length; a++) sP["import"](e, a);
	t && console.log(t)
});