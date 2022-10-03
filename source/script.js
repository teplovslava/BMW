document.addEventListener('DOMContentLoaded',()=>{
    const nextBtn = document.querySelector('.swiper-button-next')
    const prevBtn = document.querySelector('.swiper-button-prev')
    const openBtn1 = document.querySelector('.info')
    const closeBtn1 = document.querySelector('.info__top button')
    const modal = document.querySelector('.info__text')
    const modalH2 = document.querySelector('.modal__h2')
    const headerP = document.querySelector('.header__p')
    const modalText = document.querySelector('.modal__text')
    const likeBtn = document.querySelector('.likes svg')
    const likesCount= document.querySelector('.likes__count p span')   
     const slider = document.querySelectorAll('.swiper-wrapper')[1]
     const slider1 = document.querySelectorAll('.swiper-wrapper')[0]
     const arr = []
     let count = 0;
     let isOpen = false
     let firstLoad = false
     let secondLoad = false

    
    const swiper = new Swiper('.swiper', {
        effect: 'creative',
        creativeEffect: {
          prev: {
            translate: ['-65%', 0, -1],
          },
          next: {
            translate: ['100%', 0, 0],
          },
        },
        direction: 'horizontal',
        parallax: true,
        loop: false,
        simulateTouch: false,
        observer: true,
        observeParents: true,
        speed: 1500,

        
    onSlideChangeEnd: function(swiper){ 
        swiper.update (); 
        
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        });
    
        

    localStorage.getItem(`slide${count}`)?likeBtn.classList.add('liked'):likeBtn.classList.remove('liked')

    fetch(`https://private-anon-79622be4d0-grchhtml.apiary-mock.com/slides?offset=0&limit=3`)
    .then(response => response.json())
    .then(response=>arr.push(response.data))
    .then(response=>{
     arr[0].map(item=>{
    slider.innerHTML+=`<div class="swiper-slide"><img src=${item.imgUrl} alt=''/></div>`;})})
    .then(response=>{
        arr[0].map((item,index)=>{
       slider1.innerHTML+=`<div class="swiper-slide">${index===0?`The Razorite`:`0${index}`}</div>`;}) })
    .then(response=>{likesCount.innerHTML = localStorage.getItem(`slide${count}`)
                                            ?localStorage.getItem(`slide${count}`)
                                            : arr[0][0].likeCnt})
    .then(response=>(modalH2.innerHTML = arr[0][0].title))
    .then(response=>(modalText.innerHTML = arr[0][0].desc))
    .catch(err => {slider.innerHTML+=`<div class="swiper-slide"><div class="bg-error"><p>ERROR</p></div></div>`
                    headerP.innerHTML="////////";
                    slider1.innerHTML+=`<div class="swiper-slide">00</div>`
                    })

   
            function askAPI(count){
                fetch(`https://private-anon-79622be4d0-grchhtml.apiary-mock.com/slides?offset=${count}&limit=3`)
                .then(response => response.json())
                .then(response=>arr.push(response.data))
                .then(response=>{
                 arr[count/3].map(item=>{
                slider.innerHTML+=`<div class="swiper-slide" >
                                    <img src=${item.imgUrl} alt=''/>
                                    </div>`;})})
                .then(response=>{
                    arr[count/3].map((item,index)=>{
                   slider1.innerHTML+=`<div class="swiper-slide">
                                        ${item.id===0?`The Razorite`:`0${item.id}`}
                                       </div>`;}) })
                .catch(err => {slider.innerHTML+=`<div class="swiper-slide"><div class="bg-error"><p>ERROR</p></div></div>`
                                       headerP.innerHTML="////////"
                                       slider1.innerHTML+=`<div class="swiper-slide">0${arr[0].length}</div>`
                                       })
                                       
            }
    

    



    nextBtn.addEventListener('click',function(){
        count++;
        tohtml(count)
        if(((count+1)%3 ==0 && !firstLoad) || ((count+1)%3 ==0 && !secondLoad)){
            if((count+1)%3 ==0 && (count+1)/3 ==1){
                firstLoad = true
            }
            if((count+1)%3 == 0 && (count+1)/3 == 2){
                secondLoad = true
            }
            askAPI(count+1)
        }
    })

    prevBtn.addEventListener('click',function(){
        count--;
        tohtml(count)
    })

    closeBtn1.addEventListener('click',function(){
        modal.style.display = 'none'
        isOpen=false
        dis()
    })

    openBtn1.addEventListener('click',function(){
        modal.style.display = 'block'
        isOpen=true
        dis()
        

    })

    document.addEventListener('click',function(e){
     let mod = e.target.closest('.modal');
     let opBtn = e.target.closest('.info');
     
     if (!(mod || opBtn)) {
        modal.style.display = 'none'
        isOpen=false
        dis()
    }
    })


    function dis(){
        if(isOpen){
            nextBtn.classList.add('disabled')
            prevBtn.classList.add('disabled')
        }else{
            nextBtn.classList.remove('disabled')
            prevBtn.classList.remove('disabled')
        }
    }

    function tohtml(count){
       likesCount.innerHTML = localStorage.getItem(`slide${count}`)
                                ?localStorage.getItem(`slide${count}`)
                                : arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].likeCnt
        localStorage.getItem(`slide${count}`)?likeBtn.classList.add('liked'):likeBtn.classList.remove('liked')
        modalH2.innerHTML = arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].title
        modalText.innerHTML = arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].desc
    }

    likeBtn.addEventListener('click', function(){
        likeBtn.classList.add('liked')
        localStorage.setItem(`slide${count}`, arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].likeCnt+1);
        likesCount.innerHTML =arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].likeCnt+1
        axios.post(`https://private-anon-79622be4d0-grchhtml.apiary-mock.com/slides/${count}/like`,{like:arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].likeCnt+1})
        .catch(err => { 
            if (err.response) { 
                likeBtn.innerHTML+=`<div class="likes__err">Ой, похоже что-то пошло не так! Попробуйте позже...</div>`
                localStorage.removeItem(`slide${count}`);
                likesCount.innerHTML =arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].likeCnt
            } else if (err.request) { 
                likeBtn.innerHTML+=`<div class="likes__err">Ошибка! Попробуйте позже...</div>`
                localStorage.removeItem(`slide${count}`);
                likesCount.innerHTML =arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].likeCnt
            }

          })

})


Share = {
	vk: function() {
		url  = 'http://vkontakte.ru/share.php?';
		url += 'url='          + "URL";
		url += '&title='       + arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].imgUrl;
		url += '&image='       + arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].imgUrl;
		url += '&noparse=true';
		Share.popup(url);
	},
	ok: function() {
		url  = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
		url += '&st.comments=' + arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].title;
		url += '&st._surl='    +  arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].imgUrl;
		Share.popup(url);
	},
	fb: function() {
		url  = 'http://www.facebook.com/sharer.php?s=100';
		url += '&p[title]='     + arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].title;
		url += '&p[images][0]=' + arr[count<2?0:Math.floor(count/3)][count<3?count:count%3].imgUrl;
		Share.popup(url);
	},

	popup: function(url) {
		window.open(url,'','toolbar=0,status=0,width=626,height=436');
	}
};

})