jQuery(document).ready(function ($) {
    $(window).on('scroll load', function () {
        if ($(window).scrollTop() >= 1) {
            $('.header').addClass('fixed');
        } else {
            $('.header').removeClass('fixed');
        }
    });

    // ДЛЯ DISABLED КНОПКИ, ЕСЛИ ЧЕКБОКС В ФОРМЕ НЕ CHECKED
    $('.form__confirm input').click(function () {
        var isChecked = $(this).prop('checked');
        var $submitButton = $(this).closest('.form').find('button[type="submit"]');
        $submitButton.prop('disabled', !isChecked);
    });

    // ДЛЯ ОТКРЫТИЯ МОДАЛКИ
    function openModalOrMenu(trigger, targetSelector) {
        $(trigger).addClass('active');
        $('body').css('overflow-y', 'hidden');
        $(targetSelector).on('click', function (e) {
            if (e.target === this) {
                $(this).removeClass('active');
                $('body').css('overflow-y', 'initial');
            }
        });
    }

    // ДЛЯ ЗАКРЫТИЯ МОДАЛКИ, КОГДА ПРОКЛИКАНО ЗА ПРЕДЕЛЫ МОДАЛКИ
    function closeModalOrMenu(trigger) {
        $(trigger).removeClass('active');
        $('body').css('overflow-y', 'initial');
    }

    // ДЛЯ ВЫБОРА HREF ДЛЯ МОДАЛКИ
    $('a.getModal').on('click', function (e) {
        e.preventDefault();
        let triggerHref = $(this).attr('href');
        openModalOrMenu(triggerHref, triggerHref);
    });

    // ДЛЯ ЗАКРЫТИЯ МОДАЛКИ
    $('.modal__close').on('click', function () {
        closeModalOrMenu($(this).parents('.modal'));
    });

    // ДЛЯ ЗАКРЫТИЯ МОБИЛЬНОГО МЕНЮ
    $('.mobile-menu__close, .mobile-menu, .mobile-menu a').on('click', function () {
        closeModalOrMenu($(this).parents('.mobile-menu'));
    });
});

// МАСКА ДЛЯ ТЕЛЕФОНА В input[type='tel']
let maskedPhones = document.querySelectorAll("input[type='tel']");
for (var i = 0; i < maskedPhones.length; i++) {
    new IMask(maskedPhones[i], {
        mask: '+{7} (000) 000-00-00',
        placeholder: {
            show: 'always'
        }
    });
}

// ДЛЯ ЗАКРЫТИЯ МОДАЛКИ, КОГДА ПРОКЛИКАНО ЗА ПРЕДЕЛЫ МОДАЛКИ - УНИВЕРСАЛЬНЫЙ
let body = document.querySelector('body')
function closeModal(modalName, reverse = false) {
    modalName = document.querySelector(modalName)
    window.addEventListener('click', function (e) {
        if (reverse) {
            if (e.target === modalName) {
                modalName.classList.remove('active')
                body.style.overflowY = 'initial'

            }
        } else {
            if (e.target !== modalName) {
                modalName.classList.remove('active')
                body.style.overflowY = 'initial'

            }
        }

    })
}
closeModal('.modal', true)
closeModal('.mobile-menu', true)


function createTab(tabName, contentName, selectName) {
    tabName = document.querySelectorAll(tabName);
    contentName = document.querySelectorAll(contentName);
    const select = document.querySelector(selectName);

    if (select) {
        let tabsArray = Array.from(tabName);
        tabsArray.map((tab, tabIndex) => {
            tab.addEventListener('click', function (e) {
                e.preventDefault();
                for (let tabAll of tabName) tabAll.classList.remove('active');
                this.classList.add('active');

                for (let tabsContents of contentName) tabsContents.classList.remove('active');
                contentName[tabIndex].classList.add('active');
                select.selectedIndex = tabIndex;
            });
        });

        select.addEventListener('change', function () {
            let selectedIndex = this.selectedIndex;

            for (let tabAll of tabName) tabAll.classList.remove('active');
            for (let tabsContents of contentName) tabsContents.classList.remove('active');

            tabName[selectedIndex].classList.add('active');
            contentName[selectedIndex].classList.add('active');
        });
    }
}
createTab('.catalog .tabs__item', '.catalog .tabs__content', '.catalog__select');



// ФУНКЦИЯ ДЛЯ АККОРДИОНОВ - УНИВЕРСАЛЬНЫЙ
function createAccordion(target, content, singleOn, startFrom) {
    const style = document.createElement('style');
    style.innerHTML = `
        .accordion-style {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.2s ease-out;
        }
    `;
    document.head.appendChild(style);

    target = document.querySelectorAll(target);
    content = document.querySelectorAll(content);

    for (let contentItem of content) {
        // Parent element creation
        let parentElement = document.createElement('div');

        // Adding class to parent
        parentElement.classList.add('accordion-content');

        contentItem.parentNode.insertBefore(parentElement, contentItem);
        parentElement.appendChild(contentItem);
        parentElement.classList.add('accordion-style');
    }

    if (target[startFrom]) {
        target[startFrom].classList.add('active');
        let nextElement = target[startFrom].nextElementSibling;
        nextElement.style.maxHeight = nextElement.scrollHeight + "px";
    }

    if (singleOn) {
        for (let targetItem of target) {
            targetItem.addEventListener('click', function () {
                for (let targetItem of target) {
                    targetItem.classList.remove('active');
                    targetItem.nextElementSibling.style.maxHeight = null;
                }

                this.classList.toggle('active');
                let itemContent = this.nextElementSibling;

                if (itemContent.style.maxHeight) {
                    itemContent.style.maxHeight = null;
                } else {
                    itemContent.style.maxHeight = itemContent.scrollHeight + "px";
                }
            });
        }
    } else {
        for (let targetItem of target) {
            targetItem.addEventListener('click', function () {
                this.classList.toggle('active');
                let itemContent = this.nextElementSibling;

                if (itemContent.style.maxHeight) {
                    itemContent.style.maxHeight = null;
                } else {
                    itemContent.style.maxHeight = itemContent.scrollHeight + "px";
                }
            });
        }
    }
}
createAccordion('.mobile-menu__list img', '.mobile-menu__list ul', false);



// ДЛЯ ОТОБРАЖЕНИЯ КАРТЫ
function init() {
    let myMap = new ymaps.Map('map', {
        center: [55.689329, 37.535942],
        zoom: 15,
        controls: []
    }, {
        searchControlProvider: 'yandex#search'
    });
    myplacemark = new ymaps.GeoObject({
        geometry: {
            type: "Point",
            coordinates: [55.689329, 37.535942]
        },
        properties: {
            hintContent: 'улица Строителей, 6к5, Москва, 119311'
        }
    });
    myMap.behaviors.disable('scrollZoom');
    myMap.controls.add('zoomControl');
    myMap.controls.add('rulerControl', {
        scaleLine: false
    });
    myMap.geoObjects.add(myplacemark);
}

document.addEventListener('DOMContentLoaded', function () {
    let mapElement = document.getElementById('map');

    let observer = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                ymaps.ready(init);
                observer.disconnect();
            }
        });
    }, {
        threshold: 0.1
    });

    if (mapElement) {
        observer.observe(mapElement);
    }
});

// SWIPER слайдеры
const dailySlider = new Swiper('.daily__slider', {
    loop: true,
    spaceBetween: 20,
    slidesPerView: 1,
    autoHeight: true,
    navigation: {
        prevEl: ".arrow_left",
        nextEl: ".arrow_right",
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },

});

const casesSlider = new Swiper('.cases__slider', {
    loop: false,
    slidesPerView: 1,
    autoHeight: true,
    breakpoints: {
        0: {
            allowTouchMove: false,
        },
        1200: {
            allowTouchMove: true,
        },
    },
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    navigation: {
        prevEl: ".cases__arrow_left",
        nextEl: ".cases__arrow_right",
    },
    on: {
        slideChange: function () {
            updateSliderCounter(this);
        },
        init: function () {
            updateSliderCounter(this);
        }
    }
});

function updateSliderCounter(swiper) {
    const currentSlide = swiper.activeIndex + 1; 
    const totalSlides = swiper.slides.length;

    document.querySelector('.cases__count').textContent = `${currentSlide.toString().padStart(2, '0')}/${totalSlides.toString().padStart(2, '0')}`;
}

const casesImages = new Swiper('.cases__images', {
    loop: true,
    slidesPerView: 1,
    effect: 'fade',
    fadeEffect: {
        crossFade: true
    },
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
    },
    navigation: {
        prevEl: ".cases__btn_left",
        nextEl: ".cases__btn_right",
    },
});