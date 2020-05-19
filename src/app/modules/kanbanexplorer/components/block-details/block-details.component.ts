import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import { Block } from '../../models/block';

@Component({
  selector: 'app-block-details',
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.css']
})
export class BlockDetailsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private kanbanService: KanbanService) {

  }

  blockNumber: any
  block: Block
  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {
      this.blockNumber = (params.get('blockNumber'))

      this.kanbanService.getSingleBlockByNumber(this.blockNumber).subscribe((blk: Block) => {
        this.block = blk
      })
    })



  }

}
