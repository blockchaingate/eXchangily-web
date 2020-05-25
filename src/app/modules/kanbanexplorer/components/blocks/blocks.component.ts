import { Component, OnInit } from '@angular/core';
import { Block, BlockMetainfo } from '../../models/block';
import { KanbanService } from '../../services/kanban.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SearchBoxComponent } from './../search-box/search-box.component';

@Component({
  selector: 'app-blocks',
  templateUrl: './blocks.component.html',
  styleUrls: ['./blocks.component.css']
})
export class BlocksComponent implements OnInit {
  blocks: BlockMetainfo[];
  private interval;
  private onlyShowBlocksWithTxs: boolean;
  displayedColumns = ['number', 'Mined On', 'Block Info'];
  constructor(private kanbanService: KanbanService) {

    this.onlyShowBlocksWithTxs = false;
    this.getBlocks();

    // refresh latest blocks every five minutes 
    this.interval = setInterval(() => {
      this.getBlocks();
    }, 10000);
  }

  ngOnInit(): void {
  }

  leftClicked() {
    if (this.blocks !== undefined && this.blocks.length > 0) {
      const startBlock = this.blocks[this.blocks.length - 1].number.valueOf() - 1;
      this.blocks = [];
      clearInterval(this.interval);
      this.kanbanService.getLatestBlocksMetainfo(startBlock, this.onlyShowBlocksWithTxs).subscribe((blks: BlockMetainfo[]) => {
        this.blocks = [...blks];
        console.log(this.blocks);
      });
    }
  }

  rightClicked() {
    if (this.blocks !== undefined && this.blocks.length > 0) {
      const startBlock = this.blocks[0].number.valueOf() + 10;
      this.blocks = [];
      clearInterval(this.interval);
      if (this.onlyShowBlocksWithTxs) {
        this.kanbanService.getNextBlocksMetainfo(startBlock, this.onlyShowBlocksWithTxs).subscribe((blks: BlockMetainfo[]) => {
          const tmp: BlockMetainfo[] = [...blks];
          // flip the response
          for (let i = tmp.length - 1; i >= 0; i--) {
            this.blocks.push(tmp[i]);
          }
          // this.blocks = [...blks]
          console.log(this.blocks);
        });
      } else {
        this.kanbanService.getLatestBlocksMetainfo(startBlock, this.onlyShowBlocksWithTxs).subscribe((blks: BlockMetainfo[]) => {
          this.blocks = [...blks];
          console.log(this.blocks);
        });
      }
    }
  }

  test(event: MatSlideToggleChange) {
    console.log(event.checked);
    this.onlyShowBlocksWithTxs = event.checked;

    if (event.checked) {
      if (this.blocks !== undefined && this.blocks.length > 0) {
        const startBlock = this.blocks[this.blocks.length - 1].number.valueOf() - 1;
        this.blocks = [];
        clearInterval(this.interval);
        this.kanbanService.getLatestBlocksMetainfo(startBlock, this.onlyShowBlocksWithTxs).subscribe((blks: BlockMetainfo[]) => {
          this.blocks = [...blks];
          console.log(this.blocks);
        });
      }
    } else {
      // revert back to the latest blocks
      this.getBlocks();
    }

  }

  getBlocks() {

    this.kanbanService.getLatestBlocksMetainfo().subscribe((blks: BlockMetainfo[]) => {
      this.blocks = [...blks];
    });
  }

  blockNumberClicked(blk: Number) {
    console.log(blk);
  }

}
