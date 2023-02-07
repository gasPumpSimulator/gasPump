function changeColor()
{
    var element=document.getElementById("test1");
    var style=window.getComputedStyle(element,"");
    var bgColor=style.getPropertyValue("font-size");
    console.log(bgColor);
}
