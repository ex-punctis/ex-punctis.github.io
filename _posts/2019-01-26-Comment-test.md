---
layout: post
title:  Commenting test
excerpt: Testing staticman commenting
indexflag: false
tag:
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
  background:#f3f6fa;
}

.last-name {
  position:relative;
  top:0px;
  left:0px;
  width:100%;
  z-index:1;
  background:#f3f6fa;
  border:0px;
}

.nick {
  position:absolute;
  left:0px;
  top:0px;
  width:100%;
  z-index:10;
  background:#f3f6fa;
  border:0px;
}

input[type=text]:focus {
  outline: none;
}

::placeholder { /* Chrome, Firefox, Opera, Safari 10.1+ */
  color: #A04A4A4;
  opacity: 1; /* Firefox */ }
:-ms-input-placeholder { /* Internet Explorer 10-11 */
  color: #A04A4A4; }
::-ms-input-placeholder { /* Microsoft Edge */
  color: #A04A4A4; }

.comment-area {
  display:block;
  width:100%;
  height:auto;
  background:#f3f6fa;
  border:0px;
}

.comment-area:focus {
  outline: none;
}


.submit-button {
	display: block;
    position: relative;
    background-color: #f3f6fa; 
	color: black; 
	border: 1px solid #c0c0c0; 
	//border-radius: 5px; 
	margin-top: 4px;

}

.submit-button:hover {
	background-color: #F9FFFA; 
}

.submit-button:focus {
  outline: none;
}


.comment-list {
border: 1px solid #e7e7e7;
background-color: #fff;
padding: 20px;
margin-bottom: 15px;

list-style-type: none;
  margin: 4px;
  padding: 4px;

}


</style>

### Comments


<form id="comment-form" action="https://dev.staticman.net/v3/entry/github/ex-punctis/ex-punctis.github.io/master/comments" method="post">

<input name="options[redirect]" type="hidden" value="{{ site.url }}{{page.url}}">
<input name="options[postId]" type="hidden" value="{{ page.id | replace: "/", "" }}">
<input name="options[slug]" type="hidden" value="{{ page.slug }}"><br>

<div class="form-container">
    <input class = "nick" name="fields[name]"  placeholder="Displayed name" autocomplete="off" type="text" maxlength="40">
</div>

<textarea id="comment-textarea" class="comment-area" rows="2" name="fields[message]" placeholder="Comment" maxlength="1000"></textarea>
<button class="submit-button" onclick="submitForm();">Submit</button>
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

function submitForm(){
    document.getElementById("comment-form").submit();

// max comment length

// add your comment will be withing several minutes

}
</script>