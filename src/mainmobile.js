function responsiveAlbums() {
	$(".album,.content,.tab").addClass("tempActive");
	var e = $(".album").width();
	$(".album,.genre,.content,.tab").removeClass("tempActive"), $(".album .art, .genre .art").css({
		width: e,
		height: e
	});
	var t = $("#box").height() - 160;
	$(".album-large .art").css({
		width: t,
		height: t
	})
}
$(".header").on("click", ".menu-ico:not(.back)", function() {
	$(this).toggleClass("active"), $(".menu").toggleClass("active")
}), $(".genre").click(function() {
	var e = $(this).attr("class").replace(/genre| /g, ""),
		t = $(this).find(".art").css("backgroundImage"),
		a = $(this).find(".gArt").css("backgroundImage");
	$("#title").removeClass("discover"), $(".menu-ico,.menu,#pageTitle").removeClass("active"), $(".content.discover,#genreTitle,." + e).addClass("active"), $("#genreTitle").text(e), $(".menu-ico").addClass("back"), $(".bg").css({
		backgroundImage: t,
		backgroundSize: "cover"
	}), $(".genreArt").css({
		backgroundImage: a,
		backgroundSize: "contain",
		backgroundPosition: "center center",
		backgroundRepeat: "no-repeat"
	})
}), $(".genre-content").on("click", ".album", function() {
	$(".genre-content").addClass("activeIn")
}), $(".header").on("click", ".menu-ico.back", function() {
	var e = $("#title li.active").attr("class").replace(/ |active/g, ""),
		t = $(".menu-list li.active").children("span").text().toLowerCase().replace(/ /g, "");
	$(".album, .album-content,.genre, .genre-content").removeClass("active activeIn"), $(".menu-ico").removeClass("back active"), $(".content").removeClass("selected"), $("#search").val(""), $("#selectFiles").removeClass("passive"), $(".content,#genreTitle,.content .tab,.menu").removeClass("active"), $("body.discover #title").addClass("discover"), $("#pageTitle").addClass("active"), $(".content." + t).addClass("selected"), $(".content ." + e).addClass("active"), $(".bg,.genreArt").css("background", "none")
}), $(".menu-list").on("click", "li", function() {
	var e = $(this).children("span").text().toLowerCase().replace(/ /g, ""),
		t = "." + e;
	$(".menu-list li").not(this).removeClass("active"), $(this).addClass("active"), $(".menu, .menu-ico:not(.back)").removeClass("active"), $(".content").removeClass("selected"), $(t).addClass("selected"), $("body,#title").removeClass().addClass(e), $("#pageTitle").addClass("active").text(e)
}), $("#title").on("click", "li", function() {
	var e = $(this).attr("class").replace(/ |active/g, ""),
		t = "." + e;
	$("#title li").not(this).removeClass("active"), $(this).addClass("active"), $(".content .tab").removeClass("active"), $(t).addClass("active")
}), $(".bottom").on("click", ".share-btn", function(e) {
	$(".share-box").toggleClass("active")
}), $(".share-box").on("click", ".close-btn", function(e) {
	$(".share-box").toggleClass("active")
}), $("#search").keyup(function() {
	$(this).val();
	$(".menu,.menu-ico").addClass("active"), 0 == $(this).val() ? ($(".results-list").fadeOut(), $(".menu-list").fadeIn()) : ($(".menu-list").fadeOut(), $(".results-list").fadeIn())
}), $(".results-list").on("click", "li", function() {
	var e = $(this).attr("data-id");
	sP.play("#" + e)
}), responsiveAlbums(), window.addEventListener("resize", responsiveAlbums), $(".header").toggleClass("active", ".menu-ico", function() {
	$("#search").val(""), $(".results-list").fadeOut(), $(".menu-list").fadeIn()
}), $(".header").on("click", ".more", function() {
	$(this).toggleClass("active"), $("#box").toggleClass("m-ui"), responsiveAlbums()
}), $(".bottom").on("click", ".more-btn", function() {
	$(this).toggleClass("active"), $(".bottom").toggleClass("more-active")
}), $("body").on("click", "#box.m-ui .search-ico", function() {
	$(this).toggleClass("active"), $("#title p").toggleClass("sActive")
}), $(".clear-btn").click(function() {
	sP.clear("importStorage"), $("#selectFiles").removeClass("changed"), $("#iFiles").html("")
});