window.onload = function(){
  document.getElementById("loginBtn").onclick = 
    function(){
      location.href = "http://localhost:3000/auth/login"
    }
  document.getElementById("logoutBtn").onclick = 
    function(){
      location.href = "http://localhost:3000/auth/logout"
    }
}
}


