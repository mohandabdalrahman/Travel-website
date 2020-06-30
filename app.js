let controller, slideScene, pageScene, detailScene
function animateSlides() {
    controller = new ScrollMagic.Controller()

    const sliders = document.querySelectorAll('.slide')
    const nav = document.querySelector('.nav-header')
    sliders.forEach((slide, index, sliders) => {
        const revealImg = slide.querySelector('.reveal-img')
        const img = slide.querySelector('img')
        const revealText = slide.querySelector('.reveal-text')
        //GSAP
        const slidetl = gsap.timeline({
            defaults: {
                duration: 1,
                ease: 'power2.inOut'
            }
        })
        slidetl.fromTo(revealImg, { x: '0%' }, { x: '100%' })
        slidetl.fromTo(img, { scale: 2 }, { scale: 1 }, '-=1')
        slidetl.fromTo(revealText, { x: '0%' }, { x: '100%' }, '-=0.75')
        slidetl.fromTo(nav, { y: '-100%' }, { y: '0%' }, '-=0.5')
        slideScene = new ScrollMagic.Scene({
            triggerElement: slide,
            triggerHook: 0.25,
            reverse: false
        }).setTween(slidetl).addTo(controller)

        // new animation
        const pagetl = gsap.timeline()
        let nextSlide = sliders.length - 1 === index ? "end" : sliders[index + 1]
        pagetl.fromTo(nextSlide, { y: '0%' }, { y: '50%' })
        pagetl.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 })
        pagetl.fromTo(nextSlide, { y: '50%' }, { y: '0%' }, '-=0.5')
        pageScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        }).setPin(slide, { pushFollowers: false }).setTween(pagetl).addTo(controller)

    })
}


// cursor animation

const mouse = document.querySelector('.cursor')
const mouseTxt = document.querySelector('.cursor-text')
const burger = document.querySelector('.burger')
function cursorAnimate(e) {
    mouse.style.top = `${e.pageY}px`
    mouse.style.left = `${e.pageX}px`
}
function activeCursor(e) {
    const item = e.target
    if (item.id === 'logo' || item.classList.contains('burger')) {
        mouse.classList.add('nav-active')
    } else if (item.classList.contains('explore')) {
        mouse.classList.add('explore-active')
        gsap.to('.title-swipe', 1, { y: '0%' })
        mouseTxt.innerText = 'Tab'
    }
    else {
        mouse.classList.remove('nav-active', 'explore-active')
        gsap.to('.title-swipe', 1, { y: '100%' })
        mouseTxt.innerText = ''
    }
}

function navToggle(e) {
    if (!e.target.classList.contains('active')) {
        e.target.classList.add('active')
        gsap.to('.line1', 0.5, { rotate: '45', y: 5, background: '#000' })
        gsap.to('.line2', 0.5, { rotate: '-45', y: -5, background: '#000' })
        gsap.to('#logo', 1, { color: '#000' })
        gsap.to('.nav-bar', 1, { clipPath: 'circle(2500px at 100% -10%)' })
        document.body.classList.add('hide')
    } else {
        e.target.classList.remove('active')
        gsap.to('.line1', 0.5, { rotate: '0', y: 0, background: '#fff' })
        gsap.to('.line2', 0.5, { rotate: '0', y: 0, background: '#fff' })
        gsap.to('#logo', 1, { color: '#fff' })
        gsap.to('.nav-bar', 1, { clipPath: 'circle(50px at 100% -10%)' })
        document.body.classList.remove('hide')

    }
}

const logo = document.querySelector('#logo')
// Barba page translation
barba.init({
    views: [
        {
            namespace: 'home',
            beforeEnter() {
                animateSlides()
                logo.href = './index.html'
            },
            beforeLeave() {
                slideScene.destroy()
                pageScene.destroy()
                controller.destroy()

            }
        },
        {
            namespace: 'fashion',
            beforeEnter() {
                logo.href = '../index.html'
                detailAnimation()
                gsap.fromTo('.nav-header', 1, { y: '100%' }, {
                    y: '0%', ease: 'power2.inOut'
                })
            }
        }
    ],
    transitions: [
        {
            leave({ current, next }) {
                let done = this.async()

                const tl = gsap.timeline({
                    defaults: {
                        ease: 'power2.inOut'
                    }
                })
                tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 })
                tl.fromTo('.swipe', 0.75, { x: '-100%' }, { x: '0%', onComplete: done }, '-=0.5')

            },
            enter({ current, next }) {
                let done = this.async()
                // scroll to top
                window.scrollTo(0, 0)

                const tl = gsap.timeline({
                    defaults: {
                        ease: 'power2.inOut'
                    }
                })
                tl.fromTo('.swipe', 0.75, { x: '0%' }, { x: '100%', stagger: 0.25, onComplete: done })
                tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 })
            }
        }
    ]
})

// detail animation

function detailAnimation() {
    controller = new ScrollMagic.Controller()
    const slides = document.querySelectorAll('.detail-slide')
    slides.forEach((slide, index, slides) => {
        const slidetl = gsap.timeline({
            defaults: {
                duration: 1, ease: 'power2.inOut'
            }
        })
        const nextSlide = slides.length - 1 === index ? 'end' : slides[index + 1]
        const nextImg = nextSlide.querySelector('img')
        const nextText = nextSlide.querySelector('.fashion-text')
        slidetl.fromTo(slide, 1, { opacity: 1 }, { opacity: 0 })
        slidetl.fromTo(nextSlide, 1, { opacity: 0 }, { opacity: 1 }, '-=1')
        slidetl.fromTo(nextImg, 1, { x: '50%' }, { x: '0%' })
        // slidetl.fromTo(nextText, 1, { x: '-100%' }, { x: '0%' })
        // scene
        detailScene = new ScrollMagic.Scene({
            triggerElement: slide,
            duration: '100%',
            triggerHook: 0
        }).setPin(slide, { pushFollowers: false }).setTween(slidetl).addTo(controller)

    })
}



//Eventlisteners
burger.addEventListener('click', navToggle)
window.addEventListener('mousemove', cursorAnimate)
window.addEventListener('mouseover', activeCursor)

