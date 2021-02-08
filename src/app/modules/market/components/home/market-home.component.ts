import { Component, Inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { environment } from '../../../../../environments/environment';
import { KanbanService } from '../../../../services/kanban.service';
import { BannerService } from '../../../../services/banner.service';
// import {IImage } from 'ng-simple-slideshow'
import { CarouselConfig } from 'ngx-bootstrap/carousel';
import { Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LanService } from 'src/app/services/lan.service';

@Component({
  selector: 'app-market-home',
  templateUrl: './market-home.component.html',
  styleUrls: ['./market-home.component.scss'],

  providers: [
    { provide: CarouselConfig, useValue: { interval: 5000, noPause: true, showIndicators: true } }
  ]
})
export class MarketHomeComponent implements OnInit {
  message: string;
  maintainence: boolean;
  isMobile: boolean;
  banners: object;
  ready: boolean;
  constructor(
    private bannerServ: BannerService,
    private kanbanServ: KanbanService,
    private _renderer2: Renderer2,
    private lanData: LanService,
    @Inject(DOCUMENT) private _document: Document

  ) { }

  ngOnInit() {
    this.maintainence = false;
    this.isMobile = false;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      this.isMobile = true;
    }
    this.ready = false;
    console.log("ready: ", this.ready);

    this.lanData.currentMessage.subscribe(message => this.message = message)



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

    // var b = this.bannerServ.getMarketBanner();
    // this.banners = b['_body'];
    // console.log("banner: ", this.banners);

    // this.ready = true;
    // console.log("ready: ", this.ready);

    this.bannerServ.getMarketBanner().subscribe(
      (res: any) => {
        console.log("Banner:");


        // if (res && res.ok) {
        if (false) {
          this.banners = res['_body'];
          console.log(this.banners);
        } else {
          this.banners = [{
            "title": {
              "en": "Wecome to the wonderful cryptocurrency world !",
              "sc": "欢迎光临精彩的加密货币世界 ！"
            },
            "image": "./images/mslider/fabCoin.png",
            "sequence": 2,
          }, {
            "title": {
              "en": "Your Secure Digital Asset Wallet & DEX",
              "sc": "值得您信赖的数字货币钱包及去中心化交易所"
            },
            "image": "./images/mslider/fabCoin2.png",
            "sequence": 1,
          }]
            ;
        }
        this.ready = true;
        console.log("ready: ", this.ready);

      },
      err => {
        this.banners = [{
          "title": {
            "en": "Wecome to the wonderful cryptocurrency world !",
            "sc": "欢迎光临精彩的加密货币世界 ！"
          },
          "image": "./images/mslider/fabCoin.png",
          "sequence": 2,
        }, {
          "title": {
            "en": "Your Secure Digital Asset Wallet & DEX",
            "sc": "值得您信赖的数字货币钱包及去中心化交易所"
          },
          "image": "./images/mslider/fabCoin2.png",
          "sequence": 1,
        }]
          ;
        this.ready = true;
      }
    );

  }

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


}
