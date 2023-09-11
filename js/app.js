// All variables 

const elList = document.querySelector('.js-list');
const elRegionInput = document.querySelector('.js-region-input');
const elRegionName = document.querySelector('.js-region-name');
let region = "Toshkent";
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
    
];
const elDateDesc = document.querySelector('.primary__desc');
const elDateTime = document.querySelector('.primary__date-time');
const elWeekTableBody = document.querySelector('.js-data-table-body');
const elTableTemp = document.querySelector('.js-table-temp').content;
const fragment = document.createDocumentFragment();
const elTableTitle = document.querySelector('.js-table-title');
const elTableWrapper = document.querySelector('.js-table-data-wrapper');
const elInfoWrapper = document.querySelector('.js-info-wrapper');
const elDayBtn = document.querySelector('.js-day');
const elWeekBtn = document.querySelector('.js-week');
const elMonthBtn = document.querySelector('.js-month');


// Region 

function change_region(time) {
    elRegionName.textContent = region;
    elRegionInput.addEventListener('change', (evt) => {
    if(elRegionInput.value.trim().length > 0) {
        region = elRegionInput.value.trim();
        elRegionName.textContent = region;
    }

    if(time === 'daily') {
        getDaily(`https://islomapi.uz/api/present/day?region=${region}`);
        return;
    }

    if(time === 'weekly') {
        getData(`https://islomapi.uz/api/present/week?region=${region}`);
        return;
    }

    if(time === 'monthly') {
        getData(`https://islomapi.uz/api/monthly?region=${region}&month=${currentDate.getMonth() + 1}`, true);
        return;
    }

    });
}




// Date information 

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

// Default function call 

getDaily(`https://islomapi.uz/api/present/day?region=${region}`);

change_region('daily');


// Weekly and Monthly Information

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
     nodes[4].textContent = item.times.asr;
     nodes[4].datetime = date.replaceAll('.', '-');
     nodes[5].textContent = item.times.shom_iftor;
     nodes[5].datetime = date.replaceAll('.', '-');
     nodes[6].textContent = item.times.hufton;
     nodes[6].datetime = date.replaceAll('.', '-');
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

elDayBtn.addEventListener('click', (evt) => {
    elTableWrapper.style.display = 'none';
    elInfoWrapper.style.display = 'block';
    getDaily(`https://islomapi.uz/api/present/day?region=${region}`);
    change_region('daily');
}); 

elWeekBtn.addEventListener('click' , (evt) => {
    elTableWrapper.style.display = 'flex';
    elInfoWrapper.style.display = 'none';
    getData(`https://islomapi.uz/api/present/week?region=${region}`);
    change_region('weekly');
});

elMonthBtn.addEventListener('click' , (evt) => {
    elTableWrapper.style.display = 'flex';
    elInfoWrapper.style.display = 'none';
    getData(`https://islomapi.uz/api/monthly?region=${region}&month=${currentDate.getMonth() + 1}`, true);
    change_region('monthly');
});





