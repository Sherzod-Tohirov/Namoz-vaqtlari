// Date information 
const currentDate = new Date();
const current_date = new Date();
const monthMap = [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May", 
    "Iyun", 
    "Iyul",
    "Avgust",
    "Sentyabr",
    "Oktyabr",
    "Noyabr",
    "Dekabr"
    
]


const elDateDesc = document.querySelector('.primary__desc');
const elDateTime = document.querySelector('.primary__date-time');

function update_time() {
    const currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = monthMap[currentDate.getMonth()];
    let day = currentDate.getDate();
    let hours = String(currentDate.getHours()).padStart(2, '0');
    let minutes = String(currentDate.getMinutes()).padStart(2, '0');
    let seconds = String(currentDate.getSeconds()).padStart(2, '0');
    elDateTime.textContent = `${hours}:${minutes}:${seconds}s`;
    elDateDesc.textContent = `Sana: ${year} yil ${day} ${month}`;
    elDateDesc.appendChild(elDateTime);
    console.log("Hello");
}

setInterval(update_time, 1000);


// Switch Btn Active Class

const elBtnWrapper = document.querySelector('.js-btn-wrapper');
const btns = Array.from(elBtnWrapper.childNodes).filter(item => item.classList);
elBtnWrapper.addEventListener('click', (evt) => {
  if(evt.target.classList.contains('primary__btn')) {
     btns.forEach(btn => {
        if(evt.target.classList != btn.classList) {
            btn.classList.remove('active-btn');
        }
     });
     evt.target.classList.add('active-btn');
  }
});



// Daily information

const elList = document.querySelector('.js-list');

function renderDaily(data, list) {
    elItemTimes = list.querySelectorAll('.primary__item-time');
    data.forEach((item, index) => {
        elItemTimes[index].textContent = item;
    });
}

async function getDaily(url) {
    try {
        let res = await fetch(url);
        let data = await res.json();
        
        if(data && res.status == 200) {
            let new_data = Object.values(data.times);
            renderDaily(new_data, elList);
        }
        
    }catch(err) {
        console.log(err);
    }
    
}

getDaily('https://islomapi.uz/api/present/day?region=Toshkent');



// Weekly and Monthly Information


const elWeekTableBody = document.querySelector('.js-data-table-body');
const elTableTemp = document.querySelector('.js-table-temp').content;
const fragment = document.createDocumentFragment();
const elTableTitle = document.querySelector('.js-table-title');

function renderAsTable(data, node, isMonthly = false) {
    node.innerHTML = ''; 
    data.forEach(item => {
     const temp = elTableTemp.cloneNode(true);
     let nodes = temp.querySelectorAll('.info-table__data');
     let date;
     
     if(!isMonthly) {
        date = item.date.slice(0, item.date.indexOf(',')).replaceAll('/', '.');
        nodes[0].textContent = `${item.weekday} (${date})`;
     }else {
        date = item.date.slice(0, item.date.indexOf('T')).replaceAll('-', '.').split('.').reverse().join('.');
        nodes[0].textContent = `${item.weekday} (${date})`;
     }

     nodes[1].textContent = item.times.tong_saharlik;
     nodes[1].datetime = date.replaceAll('.', '-');
     nodes[2].textContent = item.times.quyosh;
     nodes[2].datetime = date.replaceAll('.', '-');
     nodes[3].textContent = item.times.peshin;
     nodes[3].datetime = date.replaceAll('.', '-');
     nodes[4].textContent = item.times.shom_iftor;
     nodes[4].datetime = date.replaceAll('.', '-');
     nodes[5].textContent = item.times.hufton;
     nodes[5].datetime = date.replaceAll('.', '-');
     fragment.appendChild(temp);
    }); 
    elTableTitle.textContent = monthMap[currentDate.getMonth()];
    node.appendChild(fragment);
}



async function getData(url, isMonthly = false) {
    let res = await fetch(url);
    let data = await res.json();

    if(data && res.status == 200) {
        renderAsTable(data, elWeekTableBody, isMonthly); 
    }
}


// Daily, Weekly, Monthly Information 


const elTableWrapper = document.querySelector('.js-table-data-wrapper');
const elInfoWrapper = document.querySelector('.js-info-wrapper');
const elDayBtn = document.querySelector('.js-day');
const elWeekBtn = document.querySelector('.js-week');
const elMonthBtn = document.querySelector('.js-month');


elDayBtn.addEventListener('click', (evt) => {
    elTableWrapper.style.display = 'none';
    elInfoWrapper.style.display = 'block';
    getDaily('https://islomapi.uz/api/present/day?region=Toshkent');
}); 

elWeekBtn.addEventListener('click' , (evt) => {
    elTableWrapper.style.display = 'flex';
    elInfoWrapper.style.display = 'none';
    getData('https://islomapi.uz/api/present/week?region=Toshkent');
});

elMonthBtn.addEventListener('click' , (evt) => {
    elTableWrapper.style.display = 'flex';
    elInfoWrapper.style.display = 'none';
    getData(`https://islomapi.uz/api/monthly?region=Toshkent&month=${currentDate.getMonth() + 1}`, true);
});





