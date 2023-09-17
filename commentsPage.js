const topicId = sessionStorage.getItem("selectedTopicId");
const commentDiv = document.querySelector('.theme-content .comment');
const homeBtn = document.querySelector("nav a");
//console.log(homeBtn);
homeBtn.addEventListener("click", ()=>window.location = "./index.html");
const firstCommentUrl = "http://localhost:3030/jsonstore/collections/myboard/posts"+ "/" + topicId;
const commentsUrl = " http://localhost:3030/jsonstore/collections/myboard/comments";


window.addEventListener('load', loadComments);

async function loadComments (){
    commentDiv.replaceChildren();
    let isFirst = true;
    await fetch (firstCommentUrl)
    .then (response => response.json())
    .then (data => {
        isFirst = true;
        commentDiv.appendChild(createCreatorCommnetFn(data, isFirst))
    });

    await fetch (commentsUrl)
    .then (response => response.json())
    .then (data => {
        for (const comment in data) {
            
            if (Object.keys(data[comment]).length !== 0 && data[comment].topicId == topicId) {
                isFirst = false;
                commentDiv.appendChild(createCreatorCommnetFn(data[comment], isFirst))
            };
        };
    });
};


function createCreatorCommnetFn(topicObj, isFirst){
    const headDiv = document.createElement("div");
    headDiv.className = "header";

    const img = document.createElement('img');
    img.alt = "avatar";
    img.src = "./static/profile.png";
    headDiv.appendChild(img);

    const p1 = document.createElement('p')
    let p1textContent = document.createTextNode(" posted on ");
    if(isFirst === false){
        p1textContent.nodeValue =" commented on ";
    }

    //p1.textContent = " posted on ";
    
    const span = document.createElement('span');
    span.textContent = topicObj["username"];
    p1.appendChild(span);
    p1.appendChild(p1textContent);

    const time = document.createElement("time");

    time.textContent = topicObj["createdOn"];
    p1.appendChild(time);

    headDiv.appendChild(p1);

    const p2 = document.createElement('p');
    p2.className = "post-content";
    p2.textContent = topicObj["postText"];
    headDiv.appendChild(p2);

    return headDiv;
};

const commentForm = document.querySelector(".answer form");
const commentPostBtn = document.querySelector(".answer button");
commentPostBtn.addEventListener('click', postCommentFn);

async function postCommentFn(event){
    event.preventDefault();
    const formData = new FormData (commentForm);
    const timeStamp = new Date();
    const body = {
        "createdOn" : timeStamp,
        "username" : formData.get("username"),
        "postText" : formData.get("postText"),
        "topicId" : topicId
    };

    try {
        if(formData.get("username")=="" || formData.get("postText") == ""){
            throw new Error("all fields must be filled !")
        }else {
            await fetch (commentsUrl, {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            })
            commentForm.reset();
            loadComments ();
        }
    } catch (error) {
        alert(error.message)    
    }
}
