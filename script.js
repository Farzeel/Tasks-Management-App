


const writeTask = document.querySelector("#writeTask");
const addTask = document.querySelector("#addTask");
const taskList = document.querySelector("#taskList");
const clearAll = document.querySelector("#clearAll");
const searchInput = document.querySelector("#findTask");
const searchButton = document.querySelector("#searchTask");
// const searchHistory = document.querySelector("#searchHistory");
// const clearhistory = document.querySelector("#clearhistory");
const entriesPerPageSelect = document.getElementById('entriesPerPage');
const pageInfo = document.getElementById('pageInfo');
const pages = document.getElementById('pages');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const logoutBtn = document.querySelector("#logout");
const signupregister = document.querySelector("#signupregister");
const loginregister = document.querySelector("#loginregister");
const dismisableAlert = document.querySelector("#dismisable-alert");
const deleteAccount = document.querySelector("#deleteAccount");
const avatar = document.querySelector("#avatar");
const nameOfuser = document.querySelector("#nameOfuser");
const remindtimer = document.getElementById("remindtimer")

document.addEventListener('DOMContentLoaded', function() {
  if (Notification.permission !== 'denied') {
      Notification.requestPermission()     
  }
});


// CLASS OF USER
class User{
  constructor(userId,userName,password){
    this.userId = userId
    this.userName = userName
    this.password = password
  }
}

let curretPage = 1
let entriesPerPage = parseInt(entriesPerPageSelect.value)
let currentSearchPage = 1;
let paginationPages = 4



clearAll.style.display = "none";
logoutBtn.style.display = "none";
deleteAccount.style.display = "none";
nameOfuser.style.display = "none";
avatar.style.display = "none";


window.addEventListener("DOMContentLoaded",CheckedLoggedIn)
// LOAD CONTENT FROM LOCAL STORAGE ON PAGE LOAD
window.addEventListener("DOMContentLoaded",loadTaskFromLoacalStorage)

// INITIALIZING THE ARRAY OF TASKS
let tasks = []
let srchHistory = []
let users = []
let currentUser = null;
let uniqueUserID= localStorage.getItem("uniqueUserID") || 0

function ShowAlert(strong,message,color){
dismisableAlert.innerHTML  = `
<div class="alert alert-${color} alert-dismissible fade show" role="alert">
  <strong>${strong}!</strong> ${message}.
  <button type="button" class="close" data-dismiss="alert" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
</div>

`

}

function validateText(text) {
  text = text.replace(/\s+/g, '').trim();
  if (text.length < 3 || text.length >15) {
    return false;
  }

  return true;
}



function validatePassword(text) {
  text = text.replace(/\s+/g, '').trim();
  if (text.length < 5) {  
    return false;
  }
// Return true if the text is valid.
  return true;
}


let signupuser = document.getElementById("signupuser");
let signupass = document.getElementById("signuppass");
function validateForm() {


  let usernameIsValid = validateText(signupuser.value);
  let passwordIsValid = validatePassword(signupass.value);

  if (!usernameIsValid) {
    document.getElementById("usernameError").innerText="username must be 3 to 15 characters"
  }
  else{
    document.getElementById("usernameError").innerText=""
  }
  if(!passwordIsValid){
    document.getElementById("passwordError").innerText="password must be atleast of 5 character"
  }else{

    document.getElementById("passwordError").innerText=""
  }


  if (usernameIsValid && passwordIsValid) {
    signupregister.disabled = false;

  } else {
    signupregister.disabled = true;
  }
}


signupuser.addEventListener('input', validateForm);
signupass.addEventListener('input', validateForm);


function RegisterUser() {

if (signupuser.value && signupass.value) {
 
  if (!users.some(item=>item.userName ===signupuser.value)) {
    uniqueUserID++
      const newUser = new User(uniqueUserID,signupuser.value.replace(/\s+/g, ' ').trim(),signupass.value)
      users.push(newUser)
     
      SaveTaskToLocalStorage()
      ShowAlert("Sucess","Your Account has been Registered","success")
    }
    else{
      ShowAlert("Error","username already in use ","warning")
    }
}else{
  ShowAlert("Error","Input Fields Cannot be Empty ","warning")
}

  


}


function LoginUser(e) {
  e.preventDefault()
  let username = document.getElementById("loginuser").value;
  let password = document.getElementById("loginpass").value;

  const user = users.find(item=>item.userName ===username && item.password===password)

  if (user) {
   
    currentUser=user
    localStorage.setItem("currentUser",JSON.stringify(user))
  
    logoutBtn.style.display = "block";
    deleteAccount.style.display = "block";
    nameOfuser.style.display = "block";
    avatar.style.display = "block";
    nameOfuser.innerText = currentUser.userName
    document.getElementById("signupdisplay").style.display = "none";
    document.getElementById("logindisplay").style.display = "none";
    loadTaskFromLoacalStorage()
    ShowAlert("Success",`You are loggedIn as ${currentUser.userName} `,"success")

  }else{
    ShowAlert("Error",`"invalid user name or password"`,"warning")

  }

}

function CheckedLoggedIn() {
  const savedUser = localStorage.getItem("currentUser")
  if (savedUser) {
    currentUser = JSON.parse(savedUser)
    nameOfuser.innerText = currentUser.userName
    document.getElementById("signupdisplay").style.display = "none";
    document.getElementById("logindisplay").style.display = "none";
    logoutBtn.style.display = "block";
    deleteAccount.style.display = "block";
    nameOfuser.style.display = "block";
    avatar.style.display = "block";
  }

}


function LogoutUser() {

  currentUser = null
  localStorage.removeItem("currentUser")
  logoutBtn.style.display = "none";
  deleteAccount.style.display = "none";
  nameOfuser.style.display = "none";
    avatar.style.display = "none";
  document.getElementById("signupdisplay").style.display = "block";
  document.getElementById("logindisplay").style.display = "block";
  loadTaskFromLoacalStorage()
}


function AccountDeletion(e) {
  e.preventDefault()
if (confirm("are you sure you want to delete youe Account")) {
  let filteruser = users.filter(item=>item.userId !=currentUser.userId)
  users = filteruser
 
  let filterTasks = tasks.filter(task=>task.userId !=currentUser.userId)

  tasks = filterTasks
  SaveTaskToLocalStorage()
 LogoutUser()
}


}


// GETTING ID FOR THE TASK FROM LOCAL STORAGE
let id =parseInt(localStorage.getItem("lastId"))  || 0;


// SAVE TASKS TO LOCAL STORAGE
function SaveTaskToLocalStorage(){
    localStorage.setItem("users",JSON.stringify(users))
    localStorage.setItem("lastId",id.toString())
    localStorage.setItem("uniqueUserID",uniqueUserID.toString())
    localStorage.setItem("tasks",JSON.stringify(tasks))
}

// LOAD TASKS FROM LOCAL STORAGE
function loadTaskFromLoacalStorage() {
    // RegisterUser()
    let savedTasks = localStorage.getItem("tasks")
    let saveduser = localStorage.getItem("users")
    if (savedTasks) {
      
      tasks = JSON.parse(savedTasks);
    }
    if(saveduser){
      users = JSON.parse(saveduser)
    }
    
    if (currentUser) {

        setInterval(CheckReminder, 60000);
      let filtertasks = filterTasksByCurrentUser()
     
      if (filtertasks.length===0 ) {
          taskList.innerHTML = `
          <div class="jumbotron">
          <p class="lead my-0">Task Lsit is empty </p>
          <hr class="my-2">
        </div>
          `
          clearAll.style.display = "none";
          currentSearchPage = 1
          Rendertasks()
   
      }else{
        if (filtertasks) {
          taskList.innerHTML = "";
        }
        currentSearchPage = 1
         
          Rendertasks()
          clearAll.style.display = "block";
      }
    GeneralInfo()
    }else{
      taskList.innerHTML = `
      <div class="jumbotron">

  <p class="lead my-0">Sign-up To Start Your Journey  </p>
  <hr class="my-2">

</div>
      
      `
      clearAll.style.display = "none";
      Rendertasks()
    }
  
}


function GeneralInfo(){
  let totalTasks = document.querySelector(".totalTasks")
  let completed = document.querySelector(".completed")
  let pending = document.querySelector(".pending")
  let filteruser = filterTasksByCurrentUser()
  totalTasks.innerHTML = `Total Tasks:${filteruser.length}`
  let abc= filteruser.filter(item=>item.markAsDone===true)
  completed.innerHTML = `Task Completed:${abc.length}` 
  let xyz= filteruser.filter(item=>item.markAsDone===false)
  pending.innerHTML =`Pending Tasks:${xyz.length}` 
}


// SOME EVENT LSITNERS
entriesPerPageSelect.addEventListener('change', function() {
  entriesPerPage = parseInt(this.value);

  curretPage = 1;
 loadTaskFromLoacalStorage();
});

document.getElementById('filter').addEventListener('change', function() {

  // loadTaskFromLoacalStorage();
  loadTaskFromLoacalStorage();
});
document.getElementById('sort').addEventListener('change', function() {
  loadTaskFromLoacalStorage();
});


function filterTasksByCurrentUser() {
  return tasks.filter(task => task.userId === currentUser.userId);
}

// REMINDER OF TASKS
function CheckReminder(){

   let userTasks = filterTasksByCurrentUser()
  const now = new Date;

  userTasks.forEach(task=>{
      if (new Date(task.remind).toLocaleTimeString() <= now.toLocaleTimeString() && !task.notified) {
          const notification = new Notification('Task Reminder', {
              body: `Task: ${task.content}`,
              icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFa9R66hS28ppjMF1WyUjcYwsrpJ19rctBPjidZwA&s",
              badge: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFa9R66hS28ppjMF1WyUjcYwsrpJ19rctBPjidZwA&s", 
              
          });
          notification.addEventListener('click', () => {
              window.location.href = 'http://127.0.0.1:5500/Advanced-To-do-list/index.html'; 
          });
            task.notified = true;
            SaveTaskToLocalStorage()
            loadTaskFromLoacalStorage()
       
      }
  })
}


  // setInterval(CheckReminder, 6000);


function Rendertasks() {
 
if (currentUser) {

  pageInfo.style.display = "block"
  document.querySelector(".filter-options").style.display = "block"
  document.querySelector(".entries").style.display = "block"
  document.querySelector(".sort-options").style.display = "block"
  document.querySelector(".genInformation").style.display = "block"
  document.querySelector("#pagination").style.display = "block"
  
  
  let startIndex = (curretPage - 1)* entriesPerPage
  let endIndex = (startIndex + entriesPerPage)
  // let limitedResult = tasks.slice(startIndex, endIndex);
  let limitedResult;
  let filterdTasks = filterTasksByCurrentUser()


  let totalPages  = filterdTasks.length>0? Math.ceil(filterdTasks.length/entriesPerPage):1;

  let startPage = Math.max(1,curretPage - Math.floor(paginationPages/2))
  let endPage = Math.min(totalPages,startPage + paginationPages - 1)

  const filterOption = document.getElementById('filter').value;
  const sortOption = document.getElementById('sort').value;

  if (filterOption === 'important') {
      limitedResult = filterdTasks.filter(item => item.markasImportant === true).slice(startIndex, endIndex);
      totalPages  = limitedResult.length>0?Math.ceil(limitedResult.length/entriesPerPage):1;
  } 
  else if (filterOption === 'undone') {
      limitedResult = filterdTasks.filter(item => item.markAsDone === false).slice(startIndex, endIndex);
      totalPages  = limitedResult.length>0?Math.ceil(limitedResult.length/entriesPerPage):1;
  } 
  else if (filterOption === 'impundone') {
      limitedResult = filterdTasks.filter(item => item.markAsDone === false && item.markasImportant === true).slice(startIndex, endIndex);
      totalPages  = limitedResult.length>0?Math.ceil(limitedResult.length/entriesPerPage):1;
  } 
  else if (filterOption === 'done') {
      limitedResult = filterdTasks.filter(item => item.markAsDone === true).slice(startIndex, endIndex);
      totalPages  = limitedResult.length>0?Math.ceil(limitedResult.length/entriesPerPage):1;

  } 
  else {
      limitedResult = filterdTasks.slice(startIndex, endIndex);
  }

  if (filterOption==="all") {
      if (sortOption==="Id") {
    limitedResult = [...filterdTasks].sort((a,b)=> a.id - b.id).slice(startIndex, endIndex)
  }
  else if(sortOption==="important"){
    limitedResult= [...filterdTasks].sort((a,b)=>{
   
      if (a.markasImportant && !b.markasImportant) return -1;
      if (!a.markasImportant && b.markasImportant) return 1;
      return 0;
    }).slice(startIndex, endIndex)
  }
  else if(sortOption==="undone"){
    limitedResult= [...filterdTasks].sort((a,b)=>{
   
      if (!a.markAsDone && b.markAsDone) return -1;
      if (a.markAsDone && !b.markAsDone) return 1;
      return 0;
    }).slice(startIndex, endIndex)
  }
  }

  
  if (filterdTasks.length >0) {
    taskList.innerHTML = '';
}
  limitedResult.forEach(item => {
    // create_task_item(item.content,item.timestamp,item.id,item.updatedAt,item.markAsDone,item.markasImportant)
    let task_item   = document.createElement("li");
    task_item.setAttribute("id",item.id)
    task_item.classList.add("my-1","list-group-item")
  
    task_item.innerHTML = `
    <p class=" my-0"><span class="text-danger sizeChota">#MyTask</span> <span class="marg">${item.content}</span></p>
    ${!item.notified ?` <p class="reminder-time my-1 sizeChota"><span class="bold">Reminder:</span> ${item.remind ? item.remind.split("T")[1] : 'Not set'}</p>`:""}
    <input type="checkbox" class="taskComplete" ${item.markAsDone ? 'checked' : ''}>
    <label class="sizeChota">Mark as done</label>
    <input type="checkbox" class="importantTask" ${item.markasImportant ? 'checked' : ''}>
    <label class="sizeChota">Mark as important</label>
    <button title="update" class="btn btn-success btn-sm updateBtn mx-3">✎</button>
    <button title="delete" class="btn btn-danger btn-sm deleteBtn">✖</button>
    <p class="date-time my-1 sizeChota">created at (${item.timestamp}),  ${item.updatedAt ?`updated at (${item.updatedAt})`:""}</p>
  `;
  taskList.appendChild(task_item)

  if (item.markAsDone) {
    task_item.style.backgroundColor = "#90EE90";
  }else if(item.markasImportant){
    task_item.style.backgroundColor = "#FF7F7F";
  }else{
    task_item.style.backgroundColor = "#d1cfcf";
  }

  });




 
    pages.innerHTML = ""
    
  
 
for(let i = startPage ; i<=endPage; i++){
  
  pages.innerHTML += `<span class=" pageNumbers ${i == curretPage ? 'active' : ''}">${i}</span>`

}


  pageInfo.textContent = `Page ${curretPage} of ${totalPages}`;
 
  prevPageButton.disabled = (curretPage===1?true:false)
  nextPageButton.disabled = (curretPage===totalPages?true:false)

}
else{

  pageInfo.style.display = "none"
  document.querySelector(".filter-options").style.display = "none"
  document.querySelector(".entries").style.display = "none"
  document.querySelector(".sort-options").style.display = "none"
  document.querySelector(".genInformation").style.display = "none"
  document.querySelector("#pagination").style.display = "none"
}
  
}

// AfTER RENDER FUNCTION SOME CLICK LISTNER
pages.addEventListener("click",(e)=>{
  if (e.target.classList.contains("pageNumbers")) {
    let parsingInt = parseInt(e.target.innerText)
    curretPage = parsingInt

    loadTaskFromLoacalStorage()
  
  }

})

// PREVIOUS AND NEXT BUTTON

prevPageButton.addEventListener("click",()=>{
  if (curretPage > 1) {
    curretPage--;
    if (searchInput.value) {
      currentSearchPage--;
      SearchingTasks();
    } else {
      loadTaskFromLoacalStorage();
    }
  }
})
nextPageButton.addEventListener("click",()=>{
  let filterusertask = filterTasksByCurrentUser()
  let totalTasksPages = Math.ceil(filterusertask.length / entriesPerPage);
  if (curretPage < totalTasksPages) {
    curretPage++;
    if (searchInput.value) {
      currentSearchPage++;
      SearchingTasks();
    } else {
      loadTaskFromLoacalStorage();
    }
  }
})


// FUNCTION FOR ADDING TASKS 
function AddTask() {

  let userInput = writeTask.value.replace(/\s+/g, ' ').trim();
 
    if (currentUser) {
      if (userInput) {
        id +=1;
        let dateTime = getCurrent_DateTime();
      //  create_task_item(userInput,dateTime,id,null,false)
        tasks.push({id:id,content:userInput,timestamp:dateTime,updatedAt:null,markAsDone:false,markasImportant:false,userId:currentUser.userId,remind:remindtimer.value,notified:false});
     
       SaveTaskToLocalStorage();
       loadTaskFromLoacalStorage()
      //  clearAll.style.display = "block";
  
       writeTask.value = " ";
      }else{
        ShowAlert("Error",`"input field cannot be empty"`,"warning")
      }

  }
  else{
    ShowAlert("Error",`"Login to Add Tasks "`,"warning")
  }
  

}


writeTask.addEventListener("keydown", function(event){
  if(event.key=="Enter"){
  
    AddTask()
  }
})


// FOR GETTING CURRENT TIME
function getCurrent_DateTime() {
    const currentDate = new Date();
    return currentDate.toLocaleString(); // Convert the date to a string representation
  }




// FOR Handle Tasks
function HandleTasks(event) {

  // FOR DELETING THE TASK
  if (event.target.classList.contains("deleteBtn")) {
    let parentElement = event.target.parentElement
   let indexofItem = tasks.findIndex(item=>item.id == parentElement.id)
   if (confirm("Are You Sure you Want To Delete")) {
     tasks.splice(indexofItem,1)
    SaveTaskToLocalStorage()
    loadTaskFromLoacalStorage()

   }

 }

  // FOR UPDATING THE TASK
  if (event.target.classList.contains("updateBtn")) {
    let parentElement = event.target.parentElement;
    let spanText = parentElement.querySelector(".marg");
    let indexofItem = tasks.findIndex(item => item.id == parentElement.id);

    let updateText = prompt("update Text", spanText.innerText);
    if (updateText) {
        spanText.innerText = updateText;
        tasks[indexofItem].content = updateText;
        tasks[indexofItem].updatedAt = getCurrent_DateTime(); 
        tasks[indexofItem].markAsDone = false; 
        tasks[indexofItem].markasImportant = false; 
      
        SaveTaskToLocalStorage();
        
        loadTaskFromLoacalStorage()
    }
}

  // FOR MARK AS DONE AND IMPORTANT
  if (event.target.classList.contains("taskComplete") || event.target.classList.contains("importantTask") ){
    let parentElement = event.target.parentElement;
    let check = parentElement.querySelector(".taskComplete")
    let check1 = parentElement.querySelector(".importantTask")
    let indexofItem = tasks.findIndex(item => item.id == parentElement.id);


    if (check.checked ) {
  
      tasks[indexofItem].markAsDone = true;
      // tasks[indexofItem].markasImportant = true;
      SaveTaskToLocalStorage();
    }else{
  
      tasks[indexofItem].markAsDone = false;
      // tasks[indexofItem].markasImportant = true;
      SaveTaskToLocalStorage();
    }
    if (check1.checked ) {
   
      tasks[indexofItem].markasImportant = true;
      // tasks[indexofItem].markAsDone = true;
      SaveTaskToLocalStorage();
    }else{
     
      tasks[indexofItem].markasImportant = false;
      // tasks[indexofItem].markasImportant = true;
      SaveTaskToLocalStorage();
    }
      if (check.checked && check1.checked) {
        parentElement.style.backgroundColor = "#90EE90";
    
      }
    
      else if (check.checked ) {

        parentElement.style.backgroundColor = "#90EE90";
 
      }
      else if (check1.checked ) {
        parentElement.style.backgroundColor = "#FF7F7F";
 
      }else{
        parentElement.style.backgroundColor = "##d1cfcf"; 
  
      }
        
      if (searchInput.value) {
        SearchingTasks()
      }
    else  {
        
        loadTaskFromLoacalStorage()  
      }
    }

  }


function SearchingTasks() {
  if(currentUser){
  
    let userData = filterTasksByCurrentUser()
    let resultFounds = document.querySelector(".resultFounds")
  let startTime = Date.now()
  let value = searchInput.value.toLowerCase()
 
  
  let filterData = userData.filter((item) => item.content.toLowerCase().includes(value));
  let endTime = Date.now()
  if (value) {
   
 
   
      let timeTaken = (endTime - startTime)/1000
 
      resultFounds.innerText = `Found ${filterData.length} result(s) in ${timeTaken} seconds`
      taskList.innerHTML = '';
      clearAll.style.display = "none";
      let startIndex = (currentSearchPage - 1)* entriesPerPage
      let endIndex = (startIndex + entriesPerPage)
      let limitedResult = filterData.slice(startIndex, endIndex);
      let totalSearchPages = filterData.length>0? Math.ceil(filterData.length/entriesPerPage):1;

      let startPage = Math.max(1,currentSearchPage - Math.floor(paginationPages/2))
      let endPage = Math.min(totalSearchPages,startPage + paginationPages - 1)

      limitedResult.forEach((item)=>{
        let content = item.content
       
        let index = content.toLowerCase().indexOf(value);
   
        if (index !=-1) {
          let matchPart = content.slice(index,index + value.length)
          content = content.replace(matchPart, `<strong style="color: red;">${matchPart}</strong>`);
          
        }

        let task_item = document.createElement("li");
        task_item.setAttribute("id", item.id);
        task_item.setAttribute("class", "list-group-item");
        task_item.innerHTML = `
        <p class=" my-0"><span class="text-danger sizeChota">#MyTask</span> <span class="marg">${content}</span></p>
       ${!item.notified ?` <p class="reminder-time my-1 sizeChota"><span class="bold">Reminder:</span> ${item.notified && item.remind ? item.remind.split("T")[1] : 'Not set'}</p>`:""}
        <input type="checkbox" class="taskComplete" ${item.markAsDone ? 'checked' : ''}>
        <label class="sizeChota">Mark as done</label>
        <input type="checkbox" class="importantTask" ${item.markasImportant ? 'checked' : ''}>
        <label class="sizeChota">Mark as important</label>
        <button class="btn btn-success btn-sm updateBtn mx-3">✎</button>
        <button class="btn btn-danger btn-sm deleteBtn">✖</button>
        <p class="date-time my-1 sizeChota">created at (${item.timestamp}),  ${item.updatedAt ?`updated at (${item.updatedAt})`:""}</p>
        `;
       
        taskList.appendChild(task_item);
        if (item.markAsDone) {
          task_item.style.backgroundColor = "#90EE90";
        }else if(item.markasImportant){
          task_item.style.backgroundColor = "#FF7F7F";
        }else{
          task_item.style.backgroundColor = "#d1cfcf";
        }
  
       
       
        // create_task_item(content,item.timestamp,item.id,item.updatedAt,item.markAsDone,item.markasImportant)
      })
    
  
      pageInfo.textContent = `Page ${currentSearchPage} of ${totalSearchPages}`;

       pages.innerHTML = ""

      
       
        for(let i = startPage ; i<=endPage; i++){
  
          pages.innerHTML += `<span class=" pageNumbers searchpage ${i == currentSearchPage ? 'active' : ''}">${i}</span>`
        
        }

  prevPageButton.disabled = (currentSearchPage===1?true:false)
  nextPageButton.disabled = (currentSearchPage===totalSearchPages?true:false)
      

  }
  else{
    resultFounds.innerHTML = " "
    loadTaskFromLoacalStorage()
  }
  
  }
  
 

}
pages.addEventListener("click",(e)=>{
  if (e.target.classList.contains("searchpage")) {
    let parsingInt = parseInt(e.target.innerText)
    currentSearchPage = parsingInt

    SearchingTasks()
  }

})

function DisplayHistory(){}


  // CLEAR ALL TASKS
  function ClearTheTasks() {
    // localStorage.clear();
    let data = tasks.filter(item=>item.userId !=currentUser.userId)
 
    tasks=data;

    curretPage=1
    SaveTaskToLocalStorage()
    loadTaskFromLoacalStorage()
  

  }


addTask.addEventListener("click", AddTask);
taskList.addEventListener("click", HandleTasks);
clearAll.addEventListener("click", ClearTheTasks);
searchInput.addEventListener("input", SearchingTasks);
signupregister.addEventListener("click", RegisterUser);
loginregister.addEventListener("click", LoginUser);
logoutBtn.addEventListener("click", LogoutUser);
deleteAccount.addEventListener("click", AccountDeletion);
// searchHistory.addEventListener("click", DisplayHistory);
// clearhistory.addEventListener("click", ClearSearchHistory);











