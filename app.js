//console.log("Hello from app.js");
const form = document.querySelector('.new-topic-border form');
const buttons = document.querySelectorAll('.new-topic-buttons button');
const cancelBtn = buttons[0];
const postBtn = buttons[1];
const topicContainer = document.querySelector('.topic-title div');
//console.log(topicContainer);

cancelBtn.addEventListener("click", cancelPostFn);
postBtn.addEventListener("click", newTitlePostFn);

window.addEventListener("load", loadTitlesFn)

async function loadTitlesFn(){
    const url = "http://localhost:3030/jsonstore/collections/myboard/posts";
    await fetch (url)
    .then (response => response.json())
    .then (data => {
        topicContainer.replaceChildren();
        for (const topic in data) {
            topicContainer.appendChild(createTopicListElement(data[topic]));
            //console.log(data[topic]);
        }
        //console.log(data)       
    })
}

async function newTitlePostFn(event){
    event.preventDefault()
    const url = "http://localhost:3030/jsonstore/collections/myboard/posts";
    const formData = new FormData(form);
    const timeStamp = new Date();

    try {
        if (formData.get("topicName") == "" || formData.get("username") == "" || formData.get("postText") == ""){
            throw new Error ("all fields must be filled!")
        }else{
            const body = {
                "topicName" : formData.get("topicName"),
                "createdOn" : timeStamp,
                "username" : formData.get("username"),
                "postText" : formData.get("postText")
            };
            await fetch (url, {
                method: "post",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            form.reset();
            loadTitlesFn();
        };
    } catch (error) {
        alert(error.message)
    };   
};

function cancelPostFn(event){
    event.preventDefault();
    form.reset();
}

function createTopicListElement (topicObj){
    const topicDiv = document.createElement("div");
    topicDiv.className = "topic-name-wrapper";
    topicDiv.id = topicObj["_id"];
    topicDiv.addEventListener("click", (event)=>{
        const targetId = event.currentTarget.id;
        sessionStorage.setItem ("selectedTopicId", targetId);
        window.location = "theme-content.html";
    });
    
    const topicNameDiv = document.createElement("div");
    topicNameDiv.className = "topic-name";
    topicDiv.appendChild(topicNameDiv);
    
    const a = document.createElement('a');
    a.href = "#";
    a.className = "normal";
    topicNameDiv.appendChild(a);

    const h2 = document.createElement('h2');
    h2.textContent = topicObj["topicName"];
    a.appendChild(h2);

    const columnDiv = document.createElement("div");
    columnDiv.className = "columns";
    topicNameDiv.appendChild(columnDiv);

    const emptyDiv = document.createElement("div");
    columnDiv.appendChild(emptyDiv);
    
    const dateP = document.createElement("p");
    dateP.textContent = "Date: "
    emptyDiv.appendChild(dateP);

    const time = document.createElement("time");
    time.textContent = topicObj["createdOn"];
    dateP.appendChild(time)

    const usernameDiv = document.createElement("div");
    usernameDiv.className = "nick-name";
    emptyDiv.appendChild(usernameDiv);

    const userP = document.createElement("p");
    userP.textContent = "Username: ";
    usernameDiv.appendChild(userP);

    const userSpan = document.createElement("span");
    userSpan.textContent = topicObj["username"]
    userP.appendChild(userSpan);

    return topicDiv;
}