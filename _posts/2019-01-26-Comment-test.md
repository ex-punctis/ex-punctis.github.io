---
layout: post
title:  Commenting test
excerpt: Testing staticman commenting
indexflag: false
tag:
---

## Comment test


Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.




### Comments


<form id="comment-form" action="https://dev.staticman.net/v3/entry/github/ex-punctis/ex-punctis.github.io/master/comments" method="post">

<input class = "nick" name="fields[name]"  placeholder="Displayed name" autocomplete="off" type="text" maxlength="40">

<textarea id="comment-textarea" class="comment-area" rows="2" name="fields[message]" placeholder="Comment" maxlength="1000"></textarea>
<button class="submit-button" onclick="submitForm();">Submit</button>
</form>



<script>

function submitForm(){
    document.getElementById("comment-form").submit();

// max comment length

// add your comment will be withing several minutes

}
</script>