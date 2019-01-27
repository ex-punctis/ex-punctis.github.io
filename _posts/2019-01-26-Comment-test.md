---
layout: post
title:  Commenting test
excerpt: Testing staticman commenting
indexflag: false
tag: [test]
---

## Comment test


Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.


<style>
.form-container {
  display:block;
  position:relative;
  height:auto;
  margin-bottom:4px;
  padding:0px;
  width: 100%

}

.first-name {
  display:none;
}

.last-name {
  position:relative;
  top:0px;
  left:0px;
  width:100%;
  z-index:1;
}

.nick {
  position:absolute;
  left:0px;
  top:0px;
  width:100%;
  z-index:10;
}

.comment-area {
  display:block;
  width:100%;
  height:auto;
  
}
</style>


<form id="comment-form" action="https://dev.staticman.net/v3/entry/github/ex-punctis/ex-punctis.github.io/master/comments" method="post">

<input name="options[redirect]" type="hidden" value="{{ site.url }}{{page.url}}">
<input name="options[postId]" type="hidden" value="{{ page.id }}">
<input name="options[slug]" type="hidden" value="{{ page.slug }}"><br>

<div class="form-container">
    <input class = "first-name" name="fields[first_name]" autocomplete="off" type="text">
    <input class = "last-name" name="fields[last_name]" placeholder="Last name" autocomplete="off" type="text">
    <input class = "nick" name="fields[name]" type="text" placeholder="Nickname" autocomplete="off">
</div>

<textarea id="comment-textarea" class="comment-area" rows="2" name="fields[message]" placeholder="Comment"></textarea>
<input type="submit" value="Submit">
</form>


<script>

var textarea = document.getElementById("comment-textarea");
//var limit = 80; //height limit

textarea.addEventListener('keydown', expand);
             
function expand(){
    var el = this;
    setTimeout(function() {
        el.style.cssText = 'height:auto; padding:0';
        // for box-sizing other than "content-box" use:
        // el.style.cssText = '-moz-box-sizing:content-box';
        el.style.cssText = 'height:' + el.scrollHeight + 'px';
    },0);
}

</script>