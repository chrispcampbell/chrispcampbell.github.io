$(document).ready(function(){
    var selectedIndex = 0;

    var photoList = [
        {page:"http://www.flickr.com/photos/chrispcampbell/2332630432",
         static:"http://farm4.static.flickr.com/3166/2332630432_045bc8afbf"},
        {page:"http://www.flickr.com/photos/chrispcampbell/2918085920",
         static:"http://farm4.static.flickr.com/3069/2918085920_d4b74a0e1f"},
        {page:"http://www.flickr.com/photos/chrispcampbell/2920833008",
         static:"http://farm4.static.flickr.com/3057/2920833008_f875c98890"},

        {page:"http://www.flickr.com/photos/chrispcampbell/551367441",
         static:"http://farm1.static.flickr.com/209/551367441_cf0c0fa10a"},
        {page:"http://www.flickr.com/photos/chrispcampbell/486877692",
         static:"http://farm1.static.flickr.com/184/486877692_10f7025bf1"},
        // {page:"http://www.flickr.com/photos/chrispcampbell/114472216",
        //  static:"http://farm1.static.flickr.com/40/114472216_ef22731f2d"},
        {page:"http://www.flickr.com/photos/chrispcampbell/840873114",
         static:"http://farm2.static.flickr.com/1243/840873114_fe1948922d"},

        {page:"http://www.flickr.com/photos/chrispcampbell/114472110",
         static:"http://farm1.static.flickr.com/43/114472110_19bc64b097"},
        {page:"http://www.flickr.com/photos/chrispcampbell/840271191",
         static:"http://farm2.static.flickr.com/1160/840271191_950b1d1b8d"},
        {page:"http://www.flickr.com/photos/chrispcampbell/550970702",
         static:"http://farm1.static.flickr.com/240/550970702_cebdb1092e"},

        {page:"http://www.flickr.com/photos/chrispcampbell/146318874",
         static:"http://farm1.static.flickr.com/51/146318874_9b4a4e84c2"},
        {page:"http://www.flickr.com/photos/chrispcampbell/2691391255",
         static:"http://farm4.static.flickr.com/3126/2691391255_3236b504d3"},
        {page:"http://www.flickr.com/photos/chrispcampbell/2916907479",
         static:"http://farm4.static.flickr.com/3062/2916907479_33d12265e7"},

        // {page:"http://www.flickr.com/photos/chrispcampbell/2086380726",
        //  static:"http://farm3.static.flickr.com/2056/2086380726_60d1223509"},
        // {page:"http://www.flickr.com/photos/chrispcampbell/146320482",
        //  static:"http://farm1.static.flickr.com/50/146320482_294224678d"},
        {page:"http://www.flickr.com/photos/chrispcampbell/146319586",
         static:"http://farm1.static.flickr.com/47/146319586_cf5a079ac8"},
        // {page:"http://www.flickr.com/photos/chrispcampbell/447986886",
        //  static:"http://farm1.static.flickr.com/228/447986886_db701f901d"},
        {page:"http://www.flickr.com/photos/chrispcampbell/486117682",
         static:"http://farm1.static.flickr.com/215/486117682_8455ee6b31"},

        {page:"http://www.flickr.com/photos/chrispcampbell/486998648",
         static:"http://farm1.static.flickr.com/179/486998648_101415fb5b"},
         
        {page:"http://www.flickr.com/photos/chrispcampbell/2916104310",
         static:"http://farm4.static.flickr.com/3116/2916104310_7958af6fbb"},
        {page:"http://www.flickr.com/photos/chrispcampbell/2919941487",
         static:"http://farm4.static.flickr.com/3230/2919941487_47bd29aaea"},
        // {page:"http://www.flickr.com/photos/chrispcampbell/1146024752",
        //  static:"http://farm2.static.flickr.com/1105/1146024752_472b5f6881"},
        {page:"http://www.flickr.com/photos/chrispcampbell/1318071185",
         static:"http://farm2.static.flickr.com/1392/1318071185_13bcdf9ace"},
        {page:"http://www.flickr.com/photos/chrispcampbell/487029841",
         static:"http://farm1.static.flickr.com/181/487029841_a582b261b1"},
        {page:"http://www.flickr.com/photos/chrispcampbell/2915275345",
         static:"http://farm4.static.flickr.com/3050/2915275345_06da01f642"},
        // {page:"http://www.flickr.com/photos/chrispcampbell/114472488",
        //  static:"http://farm1.static.flickr.com/42/114472488_c2fbd48a10"},
        // {page:"http://www.flickr.com/photos/chrispcampbell/1484192299",
        //  static:"http://farm2.static.flickr.com/1072/1484192299_530df49709"},
        {page:"http://www.flickr.com/photos/chrispcampbell/486090810",
         static:"http://farm1.static.flickr.com/208/486090810_b4d9385187"},
    ];

    function displayThumbs() {
        for (i=0; i < photoList.length; i++) {
            $("#thumb_container ul").append("<li id='thumb_item_"+i+"'><img src='"+photoList[i].static+"_s.jpg' width='75' height='75' class='cell_img' border='0'></img></li>");
            $("#thumb_item_"+i).data("index", i)
            .click( function() {
                var index = $(this).data("index");
                if (i != selectedIndex) {
                    changeImage(index);
                }
            });
        }
    }

    function changeImage(index) {
        var pageurl = photoList[index].page;
        var imgurl = photoList[index].static + ".jpg";
        $("#image_container div").replaceWith(
            "<div class='main_img_div'><a href='"+pageurl+"'>"+
            "<img src='"+imgurl+"' class='main_img' border='0'/>"+
            "</a></div>");
        selectedIndex = index;
    }

    displayThumbs();
    changeImage(0);
});
