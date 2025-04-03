$(document).ready(function () {

    $("#owl-demo").owlCarousel({

        navigation: true, // Show next and prev buttons

        slideSpeed: 300,
        paginationSpeed: 400,

        items: 1,
        itemsDesktop: false,
        itemsDesktopSmall: false,
        itemsTablet: false,
        itemsMobile: false

    });
});


const cal_item_heading = document.querySelectorAll(".cal-item h3")
// const calculator = document.querySelector(".calculator");

let count1 = 0;
let count2 = 0;
let count3 = 0;
let count4 = 0;

function increaseCounter() {
    cal_item_heading.forEach((item, index) => {
        setInterval(() => {
            if (count1 < 1500) {
                count1++;
                cal_item_heading[0].innerHTML = count1;
            }
            if (count2 < 1400) {
                count2++;
                cal_item_heading[1].innerHTML = count2;
            }
            if (count3 < 1250) {
                count3++;
                cal_item_heading[2].innerHTML = count3;
            }
            if (count4 < 1600) {
                count4++;
                cal_item_heading[3].innerHTML = count4;
            }
        }, 5)

    })
}

increaseCounter();


const menu = document.querySelectorAll(".menu h6");
const menu_item = document.querySelectorAll(".menu-item");
const menu_items= document.querySelectorAll(".menu_items");

console.log(menu);

let item_index = 0;
menu_item[item_index].classList.add("active");
menu[item_index].classList.add("active");
console.log("added");

menu[0].addEventListener("click",()=>
{
    menu[item_index].classList.remove("active");
    menu_item[item_index].classList.remove("active");
    item_index=0;
    menu[0].classList.add("active")
    menu_item[0].classList.add("active");
    menu_item.forEach((item,index)=>
    {
        item.style.transform = `translateX(-${item_index*100}%)`;
    })
    
    console.log(item_index);
})
menu[1].addEventListener("click",()=>
{
    menu[item_index].classList.remove("active");
    menu_item[item_index].classList.remove("active");
    item_index=1;
    menu[1].classList.add("active")
    menu_item[1].classList.add("active");
    menu_item.forEach((item,index)=>
    {
        item.style.transform = `translateX(-${item_index*100}%)`;
    })
    
    console.log(item_index);
})
menu[2].addEventListener("click",()=>
{
    menu[item_index].classList.remove("active");
    menu_item[item_index].classList.remove("active");
    item_index=2;
    menu[2].classList.add("active")
    menu_item[2].classList.add("active");
    menu_item.forEach((item,index)=>
    {
        item.style.transform = `translateX(-${item_index*100}%)`;
    })
    
    console.log(item_index);
})
menu[3].addEventListener("click",()=>
{
    menu[item_index].classList.remove("active");
    menu_item[item_index].classList.remove("active");
    item_index=3;
    menu[3].classList.add("active")
    menu_item[3].classList.add("active");
    menu_item.forEach((item,index)=>   
    {
        item.style.transform = `translateX(-${item_index*100}%)`;
    })
    
    console.log(item_index);
})


const hamburgur = document.querySelector(".hamburgur");
const dropdown = document.querySelector(".dropdown")

hamburgur.addEventListener("click",()=>
{
    dropdown.classList.toggle("true");
})