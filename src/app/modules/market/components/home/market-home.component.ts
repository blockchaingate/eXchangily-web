import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { KanbanService } from '../../../../services/kanban.service';
import { BannerService } from '../../../../services/banner.service';
// import {IImage } from 'ng-simple-slideshow'
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import DefaultBanner from '../../../../../images/adv/default/default-adv.json';
import { Banner } from '../../../../models/banner';

@Component({
  selector: 'app-market-home',
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 5000, noPause: true, showIndicators: true } }
  ]
})
export class MarketHomeComponent implements OnInit {
  banners: Banner[] = [];
  // @ViewChild('canvas', { static: true })
  // canvas: ElementRef<HTMLCanvasElement>;  
  // private ctx: CanvasRenderingContext2D;

  maintainence: boolean;
  isMobile: boolean;
  constructor(private kanbanServ: KanbanService, private bannerServ: BannerService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private _document: Document

  ) {
     this.getBannerAdv();
  }
  // imageUrls: (string | IImage)[] = [
  //   { url: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg', caption: 'The first slide', href: '#config' },
  //   { url: 'https://cdn.vox-cdn.com/uploads/chorus_asset/file/9278671/jbareham_170917_2000_0124.jpg', clickAction: () => alert('custom click function') },
  //   { url: 'https://cdn.vox-cdn.com/uploads/chorus_image/image/56789263/akrales_170919_1976_0104.0.jpg', caption: 'Apple TV', href: 'https://www.apple.com/' },
  //   'https://cdn.vox-cdn.com/uploads/chorus_image/image/56674755/mr_pb_is_the_best.0.jpg',
  //   // { url: 'assets/kitties.jpg', backgroundSize: 'contain', backgroundPosition: 'center' }
  // ];

  // imageUrls = ["https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg",
  // "https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg",
  // "https://cdn.vox-cdn.com/uploads/chorus_image/image/56748793/dbohn_170625_1801_0018.0.0.jpg"];


  ngOnInit() {
    if (this.banners.length < 1) {
      this.getBannerAdv();
    }

    // this.ctx = this.canvas.nativeElement.getContext('2d');

    this.maintainence = false;
    this.isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }

    this.kanbanServ.getKanbanStatus().subscribe(
      (res: any) => {
        if (res && res.success) {
          const data = res.body;
          if (data !== 'live') {
            this.maintainence = true;
          }
        }
      },
      err => {
        if (environment.production) {
          this.maintainence = true;
        }
      });
  }

  getBannerAdv() {
    this.bannerServ.getAll().subscribe(
      res => {
        this.banners = res['_body'] as Banner[];
        if (!this.banners || this.banners.length < 1) {
          // this.banners = DefaultBanner as Banner[];
          this.getDefaultadv()
        } else {
          this.handleBaner();
        }
      },
      err => {
        // this.banners = DefaultBanner as Banner[];
        // this.handleBaner();
        this.getDefaultadv();
      }
    );
  }

  getDefaultadv() {
    this.bannerServ.getDefault().subscribe(
      res => {
        this.banners = res as Banner[];
        this.handleBaner();
      }
    )
  }

  handleBaner() {
    let currentLan = localStorage.getItem('Lan');
    if (currentLan === 'zh' || currentLan === 'cn') {
      currentLan = 'sc';
    }

    this.banners.forEach(banner => {
      const titleItem = banner.title.filter(t => t.lan === currentLan) || banner.title.filter(t => t.lan === 'en');
      if (titleItem) {
        banner.titleLan = titleItem[0].text;
      }

      const subtitleItem = banner.subtitle.filter(t => t.lan === currentLan) || banner.subtitle.filter(t => t.lan === 'en');
      if (subtitleItem) {
        banner.subtitleLan = subtitleItem[0].text;
      }

      const descItem = banner.desc.filter(t => t.lan === currentLan) || banner.desc.filter(t => t.lan === 'en');
      if (descItem) {
        banner.descLan = descItem[0].text;
      }
    });
  }

  /*
  ngAfterViewInit() {
    const script = this._renderer2.createElement('script');
    script.type = `text/javascript`;
    script.text = `
        console.log("draw function!!");

        draw();

        function draw() {
          console.log("draw start!!");
            var c = document.getElementById("canvas-club");
            var ctx = c.getContext("2d");
            var w = c.width = window.innerWidth;
            var h = c.height = window.innerHeight - 154;
            var clearColor = 'rgba(0, 0, 0, 1)';
            var max = 60;   //长条数量

            if (w < 600) {
              max = 20;
            }
            
            var drops = [];

            var img = new Image();
            img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';

            function random(min, max) {
                return Math.random() * (max - min) + min;
            }

            function O() { }

            O.prototype = {
                init: function () {
                    this.x = random(0, w); //长条x轴的初始位置
                    this.y = -100; //长条y轴的初始位置
                    this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";//长条颜色
                    this.w = 2;
                    this.h = 1;
                    this.vy = random(3, 8); //y轴下降速度
                    this.vw = 3;
                    this.vh = 1;
                    this.size = random(8, 25); //长条大小
                    this.hit = h;
                    this.a = 1;
                    this.va = .96;
                },
                draw: function () {
                    if (this.y > this.hit) {

                    } else {
                        ctx.fillStyle = this.color;
                        ctx.fillRect(this.x, this.y, this.size, this.size * 5);
                    }
                    this.update();
                },
                update: function () {
                    if (this.y < this.hit) {
                        this.y += this.vy;
                    } else {
                        if (this.a > .03) {
                            this.w += this.vw;
                            this.h += this.vh;
                            if (this.w > 100) {
                                this.a *= this.va;
                                this.vw *= .98;
                                this.vh *= .98;
                            }
                        } else {
                            this.init();
                        }
                    }

                }
            }

            function resize() {
                w = c.width = window.innerWidth;
                h = c.height = window.innerHeight -154;
            }

            function setup() {
                for (var i = 0; i < max; i++) {
                    (function (j) {
                        setTimeout(function () {
                            var o = new O();
                            o.init();
                            drops.push(o);
                        }, j * 200)
                    }(i));
                }
            }


            function anim() {
                ctx.fillStyle = clearColor;
                ctx.fillRect(0, 0, w, h);
                for (var i in drops) {
                    drops[i].draw();
                }
                requestAnimationFrame(anim);
            }


            window.addEventListener("resize", resize);

            setup();
            anim();
        }
        `
    this._renderer2.appendChild(this._document.body, script);

  }
*/
  //   private draw() {
  //     var c = document.getElementById("canvas-club");
  //     var ctx = this.ctx;
  //     var w = window.innerWidth;
  //     var h = window.innerHeight;
  //     var clearColor = 'rgba(0, 0, 0, 1)';
  //     var max = 60;   //长条数量
  //     var drops = [];

  //     var img = new Image();
  //     img.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg';

  //     function random(min, max) {
  //         return Math.random() * (max - min) + min;
  //     }

  //     function O() { }

  //     O.prototype = {
  //         init: function () {
  //             this.x = random(0, w); //长条x轴的初始位置
  //             this.y = -100; //长条y轴的初始位置
  //             this.color = "rgb(" + random(0, 255) + "," + random(0, 255) + "," + random(0, 255) + ")";//长条颜色
  //             this.w = 2;
  //             this.h = 1;
  //             this.vy = random(3, 8); //y轴下降速度
  //             this.vw = 3;
  //             this.vh = 1;
  //             this.size = random(8, 25); //长条大小
  //             this.hit = h;
  //             this.a = 1;
  //             this.va = .96;
  //         },
  //         draw: function () {
  //             if (this.y > this.hit) {

  //             } else {
  //                 ctx.fillStyle = this.color;
  //                 ctx.fillRect(this.x, this.y, this.size, this.size * 5);
  //             }
  //             this.update();
  //         },
  //         update: function () {
  //             if (this.y < this.hit) {
  //                 this.y += this.vy;
  //             } else {
  //                 if (this.a > .03) {
  //                     this.w += this.vw;
  //                     this.h += this.vh;
  //                     if (this.w > 100) {
  //                         this.a *= this.va;
  //                         this.vw *= .98;
  //                         this.vh *= .98;
  //                     }
  //                 } else {
  //                     this.init();
  //                 }
  //             }

  //         }
  //     }

  //     function resize() {
  //         w = window.innerWidth;
  //         h = window.innerHeight;
  //     }

  //     function setup() {
  //         for (var i = 0; i < max; i++) {
  //             (function (j) {
  //                 setTimeout(function () {
  //                     var o = new O();
  //                     o.init();
  //                     drops.push(o);
  //                 }, j * 200)
  //             }(i));
  //         }
  //     }


  //     function anim() {
  //         ctx.fillStyle = clearColor;
  //         ctx.fillRect(0, 0, w, h);
  //         for (var i in drops) {
  //             drops[i].draw();
  //         }
  //         requestAnimationFrame(anim);
  //     }


  //     window.addEventListener("resize", resize);

  //     setup();
  //     anim();
  // }


}
