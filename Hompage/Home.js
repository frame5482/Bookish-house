let bookData = [];

// โหลด JSON
fetch('../Bookstock.json')
  .then(res => res.json())
  .then(data => {
    bookData = data;
    renderBooks(bookData);
  })
  .catch(err => console.error('โหลด JSON ล้มเหลว:', err));

function renderBooks(data) {
    const containers = {
        'Manga': document.getElementById('manga-container'),
        'Novel': document.getElementById('novel-container'),
        'Philo': document.getElementById('Philosophy-container'),
        'Monk':  document.getElementById('Buddhist-container'),
        'Famous': document.getElementById('famous-container')
    };

    for (const key in containers) {
        if (containers[key]) containers[key].innerHTML = '';
    }

    data.forEach(book => {
        const targetContainer = containers[book.Category] || containers['Famous'];
        if (!targetContainer) return;

        const itemWrapper = document.createElement('div');
        itemWrapper.className = 'book-item';

        const img = document.createElement('img');
        img.className = 'book-img';
        img.src = '/img/Book_Img/' + book.Book_Img;
        img.alt = book.Book_Name;
        itemWrapper.appendChild(img);

        const nameDiv = document.createElement('div');
        nameDiv.className = 'book-name';
        nameDiv.innerText = book.Book_Name;
        itemWrapper.appendChild(nameDiv);

        const priceDiv = document.createElement('div');
        priceDiv.className = 'book-price';
        priceDiv.innerText = parseFloat(book.Book_Price).toFixed(2) + ' บาท';
        itemWrapper.appendChild(priceDiv);

        const btn = document.createElement('input');
        btn.className = 'add-basket';
        btn.type = 'button';
        btn.value = 'เพิ่มลงในรถเข็น';
        btn.addEventListener('click', () => alert(`ท่านได้หยิบ "${book.Book_Name}" ใส่รถเข็นแล้ว!`));
        itemWrapper.appendChild(btn);

        targetContainer.appendChild(itemWrapper);
    });
}





// Slider setup
function setupSlider(containerId, prevBtnClass, nextBtnClass, scrollAmount = 300) {
    const container = document.getElementById(containerId);
    const btnPrev = document.querySelector('.' + prevBtnClass);
    const btnNext = document.querySelector('.' + nextBtnClass);
    if (!container || !btnPrev || !btnNext) return;

    btnPrev.addEventListener('click', () => container.scrollBy({ left:-scrollAmount, behavior:'smooth' }));
    btnNext.addEventListener('click', () => container.scrollBy({ left:scrollAmount, behavior:'smooth' }));
}
// เรียก slider ทุกหมวด
setupSlider('manga-container','prev-manga','next-manga');
setupSlider('novel-container','prev-novel','next-novel');
setupSlider('Philosophy-container','prev-philo','next-philo');
setupSlider('Buddhist-container','prev-buddhist','next-buddhist');
setupSlider('famous-container','prev-famous','next-famous');




// เลือกทุก slider
document.querySelectorAll('.book').forEach(slider => {
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.classList.add('active'); // เพิ่มคลาสถ้าต้องการ styling เวลา drag
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
    e.preventDefault(); // ป้องกัน text selection
  });

  
  slider.addEventListener('mouseup', () => {
    isDown = false;
    slider.classList.remove('active');
  });

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2; // ตัวคูณ 2 เพื่อให้ลากเร็วขึ้น
    slider.scrollLeft = scrollLeft - walk;
  });
});
