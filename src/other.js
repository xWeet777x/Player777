function openAlbumByID(a, e) {
	var t = $("#" + a).parents(".album-content"),
		s = $(t).attr("class").replace(/album-content|active| /g, ""),
		n = "";
	n = $("#" + a).parents(".tab").attr("class") ? $("#" + a).parents(".tab").attr("class").replace(/tab|active|selected| /g, "") : !1, $(".menu, .menu-ico,.album,.album-content,#title p").removeClass("active"), $(".content").removeClass("selected"), $("#" + a).parents(".content").addClass("selected"), $(".content.discover .tab").removeClass("active"), n && $(".tab." + n).addClass("active"), $("#title").removeClass("discover"), $(".bottom,.content,." + s).addClass("active"), $(".menu-ico").addClass("back"), $("." + s).parent(".genre-content").addClass("active activeIn"), $(".content").addClass("lessheight");
	var o = $(".album." + s).children(".art").css("backgroundImage");
	$(".genreArt").css("background", "none"), $(".bg,.album-content." + s + " .album-large .art,#bottomArt").css({
		backgroundImage: o,
		backgroundPosition: "center center",
		backgroundSize: "cover"
	}), $(".bottom").removeClass("radio-ui"), $("#selectFiles").addClass("passive"), e && (sP.audio.load(), $("#" + a).addClass("wasplaying"), $("#playBtn.nowplaying").removeClass("nowplaying"), $(".content,.menu-ico,." + s).removeClass("active back"), $(".bg").css("background", "none"), $("#title").addClass("discover"), $("#selectFiles").removeClass("passive"), $("#title.discover li").removeClass("active"), n && $("#title.discover ." + n).addClass("active"))
}
$(".content").on("click", ".album", function() {
	var a = $(this).find(".art").css("backgroundImage"),
		e = $(this).attr("class").replace(/album| /g, ""),
		t = "." + e,
		s = $(".album-content" + t).first(),
		n = s.parents(".tab");
	$("#title").removeClass("discover"), $(".menu-ico,.menu,#title p,.tab").removeClass("active"), $(".content").addClass("active"), n.add(s).addClass("active"), $(".menu-ico").addClass("back"), $(".bottom").addClass("active"), $(".content").addClass("lessheight"), $("body.music #selectFiles").addClass("passive changed"), $(".genreArt").css("background", "none"), $(".bg,.album-content.active > .album-large .art,#bottomArt").css({
		backgroundImage: a,
		backgroundPosition: "center center",
		backgroundSize: "cover"
	});
	var o = t + " .songs li:first-child";
	sP.play(o), $(".bottom").removeClass("radio-ui")
}), $(".radio-li").click(function() {
	$(".bottom").addClass("active radio-ui"), $(".content").addClass("lessheight"), $(".album-content .songs li,.content.favoritas .songs li").removeClass("nowplaying"), $(".radio-wrapper .songs li:first-child").addClass("nowplaying"), $(".radio-wrapper .songs li").removeClass("wasplaying");
	var a = ".radio-wrapper .songs li:first-child";
	sP.play(a, "radio")
}), $(".content.radio").on("click", ".songs li", function() {
	$(".bottom").addClass("active radio-ui")
}), $(".content.favoritas").on("click", ".songs li", function() {
	$(".bottom").addClass("active").removeClass("radio-ui"), $(".content").addClass("lessheight")
}), $(".content").on("click", ".songs li", function() {
	$(".album-content").hasClass("active") && $(".bottom").removeClass("radio-ui")
}), $(".results-list").on("click", "li", function() {
	var a = $(this).attr("data-id");
	openAlbumByID(a)
}), $(document).on("ready", function() {
	sP.share(function(a) {
		sP.play("#" + a), openAlbumByID(a)
	})
}), $(document).on("ready", function() {
	sP.lastPlayed(function(a) {
		sP.play("#" + a), openAlbumByID(a, "justReadyID")
	})
}), $("#bottomArt").click(function() {
	var a = $(".songs li.nowplaying").attr("data-id") || $(".songs li.nowplaying").attr("id"),
		e = $("#" + a).parents(".album-content"),
		t = $(e).attr("class").replace(/album-content|active| /g, ""),
		s = $(".album." + t).children(".art").css("backgroundImage");
	$(".content,.tab").removeClass("selected active"), $("#title").removeClass("discover"), $(".menu-ico,.menu,#title p").removeClass("active"), $(".content").addClass("active"), e.addClass("active"), e.parents(".content,.tab").addClass("selected active"), $(".menu-ico").addClass("back"), $("#selectFiles").addClass("passive"), $(".genreArt").css("background", "none"), $(".bg,.album-content." + t + " .album-large .art").css({
		backgroundImage: s,
		backgroundPosition: "center center",
		backgroundSize: "cover"
	})
}), $(".favoritas-list").on("click", "li", function(a) {
	var e = $(".saveit, .downloadit");
	if (!e.is(a.target) && 0 === e.has(a.target).length) {
		var t = $(this).attr("data-id"),
			s = $("#" + t).parents(".album-content"),
			n = $(s).attr("class").replace(/album-content|active| /g, ""),
			o = $(".album." + n).children(".art").css("backgroundImage");
		$("#bottomArt").css({
			backgroundImage: o,
			backgroundPosition: "center center",
			backgroundSize: "cover"
		})
	}
});