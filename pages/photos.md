---
layout: page
title: photos
permalink: /photos/
show-page-title: true
---

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

<script src="{{ base.url | prepend: site.url }}/assets/js/photos.js"></script>

<style>
<!--
#thumb_container {
    position: relative;
    float: right;
    background-color:transparent;
    //background-color:#000000;
    width:332px;
    padding: 0px;
}

#thumb_container ul#thumb_list {
    margin: 0;
    padding: 0;
}

#thumb_container ul#thumb_list li {
    margin: 0;
    position: relative;
    padding: 0;
    float: left;
    list-style: none;
}

.table_content {
    width: 950px;
    margin-left: auto;
    margin-right: auto;
}

.main_img_div {
    //border: 1px solid green;
    width: 580px;
    height: 580px;
    display: table-cell;
    text-align: center;
    vertical-align: middle;
}

.main_img {
    vertical-align: middle;
}

.cell_img {
    padding: 4px;
    float: left;
    cursor: pointer;
}
-->
</style>

<div id="image_container" style="float:left;">
    <div>
    </div>
</div>

<div id="thumb_container">
    <ul id="thumb_list">
        <!-- The function displayThumbs() uses this unordered list -->
    </ul>
</div>
