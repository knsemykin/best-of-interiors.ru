document.querySelectorAll<HTMLElement>('[data-gallery]').forEach(gallery=>{
 const slides=[...gallery.querySelectorAll<HTMLElement>('.portfolio-slide')];let index=0;
 const update=(delta:number)=>{index=(index+delta+slides.length)%slides.length;slides.forEach((slide,i)=>slide.hidden=i!==index);const counter=gallery.querySelector('[data-gallery-count]');if(counter)counter.textContent=`${String(index+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;};
 gallery.querySelector('[data-gallery-prev]')?.addEventListener('click',()=>update(-1));gallery.querySelector('[data-gallery-next]')?.addEventListener('click',()=>update(1));
 let x=0,y=0;gallery.addEventListener('touchstart',e=>{x=e.changedTouches[0].clientX;y=e.changedTouches[0].clientY;},{passive:true});gallery.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-x,dy=e.changedTouches[0].clientY-y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)update(dx<0?1:-1);},{passive:true});
});
