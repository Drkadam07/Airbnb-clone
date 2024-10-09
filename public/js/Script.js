let textSwitch=document.getElementById("flexSwitchCheckDefault");
let tex_info=document.getElementsByClassName("tax-info");
textSwitch.addEventListener("click",()=>{
    for(info of tex_info){
        if(info.style.display!='inline')
    {
        info.style.display='inline';
    } else
    {
        info.style.display='none'
    }
        
    }
})
function goBack() {
    window.history.back();
  }
  // JavaScript to return to the previous page when the close button is clicked
  document.querySelector('.close-btn').addEventListener('click', function () {
    window.history.back();
  });
//texses

