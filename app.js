const closeIcon = document.querySelector('.close-icon');
const cancel = document.querySelector('.cancel');
const overlay = document.querySelector('.overlay');
const sideBar = document.querySelector('.side-bar');
const btn = document.querySelector('#btn');
const couponAdd = document.querySelector('.coupon-add');
const items = document.querySelector('.items')
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');
const name = document.querySelector('.campaign-name');
const code = document.querySelector('.campaign-code');
const time = document.querySelector('.campaign-time');
const discount = document.querySelector('.discount');
const minAmount = document.querySelector('.min-amount');

let coupons = JSON.parse(localStorage.getItem('coupons')) || [];

function closeSidebar() {
    sideBar.style.right = '-5000px';
    overlay.style.display = 'none';
    document.body.classList.remove("open");
    name.value = ''
    code.value = ''
    time.value = ''
    img.src = ''
    discount.value = ''
    minAmount.value = ''
}

function openSidebar() {
    sideBar.style.right = '0px';
    overlay.style.display = 'block';
    document.body.classList.add("open");
}



function add() {
    const img = document.getElementById('img');
    const coupon = {
        id: `${new Date().getTime()}`,
        name: name.value,
        code: code.value,
        time: time.value,
        img: img.src,
        discount: discount.value,
        minAmount: minAmount.value,
    };

    coupons.push(coupon);

    localStorage.setItem('coupons', JSON.stringify(coupons));
    closeIcon.click()
    showOffer()
}


function showOffer() {
    document.querySelectorAll('.item').forEach(item => item.remove())
    coupons.forEach(item => {
        const { name, code, discount, minAmount, id, time, img } = item
        const endTime = new Date(time).getTime();

        const x = setInterval(() => {
            const remainingTime = endTime - Date.now();
            document.getElementById(id).innerHTML = formatTime(remainingTime);

            if (endTime <= Date.now()) {

                document.getElementById(id).innerHTML = `
                    <span class="day">00</span> :
                    <span class="hours">00</span> :
                    <span class="minutes">00</span> :
                    <span class="secend">00</span>
                
                `
                let selectedId = document.getElementById(id)
                let parent = selectedId.parentElement.parentElement.nextElementSibling;
                let inactive = parent.firstElementChild.firstElementChild.lastElementChild;
                inactive.innerText = 'Inactive'
                inactive.classList.replace('active', 'inactive')
                parent.firstElementChild.firstElementChild.nextElementSibling.setAttribute("disabled", "")
                clearInterval(x)

            }
        }, 1000);


        items.innerHTML += `
                <div class="item">
                    <div class="decs-side">
                        <img width="150" src=${img} alt="">
                        <div class="desc">
                            <div id="${id}" class="counter">
                            ${formatTime(endTime - Date.now())}
                            </div>
                            <h3 class="title">${name} </h3>
                            <p class="dis-rate"><span>$${discount}</span> Off</p>
                        </div>
                    </div>
                    <div class="coupon-side">
                        <div class="cs-wrap">
                            <h3 class="coupon">Coupon <span class="active">Active</span></h3>
                            <button onclick="copyText(this)" class="c-code">${code}</button>
                            <p>* This coupon code will apply on when you shopping more then <span class="min">${minAmount}</span>
                            </p>
                        </div>
                    </div>
                </div>
                `
    })

}

showOffer()

// upload image
fileInput.addEventListener('change', function () {

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            previewImage.innerHTML = `<img id="img" src=${e.target.result} alt="">`
        };

        reader.readAsDataURL(fileInput.files[0]);
    }
    console.log(previewImage.children);
});


// copy coupon code

function copyText(text) {
    let txt = text.innerText
    navigator.clipboard.writeText(txt);
    text.innerText = 'Copied!';
    setTimeout(() => {
        text.innerText = txt
    }, 500);
}



// Format the remaining time as hours, minutes, and seconds
function formatTime(distance) {
    let days = Math.floor(distance / (1000 * 60 * 60 * 24));
    let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((distance % (1000 * 60)) / 1000);
    days = days < 10 ? '0' + days : days;
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return `
         <span class="day">${days}</span> :
        <span class="hours">${hours}</span> :
        <span class="minutes">${minutes}</span> :
        <span class="secend">${seconds}</span>
    
    `;

}

btn.addEventListener('click', openSidebar);
closeIcon.addEventListener('click', closeSidebar);
cancel.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
couponAdd.addEventListener('click', add);
