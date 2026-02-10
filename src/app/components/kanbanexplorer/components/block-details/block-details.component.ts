import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KanbanService } from '../../services/kanban.service';
import { Block } from '../../models/block';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-block-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, RouterLink, TranslateModule],
  templateUrl: './block-details.component.html',
  styleUrls: ['./block-details.component.css']
})
export class BlockDetailsComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private kanbanService: KanbanService) {
  }

  blockNumber: any;
  block: Block = {} as Block;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.blockNumber = (params.get('blockNumber'));

      this.kanbanService.getSingleBlockByNumber(this.blockNumber).subscribe((blk: Block) => {
        this.block = blk;
      });
    });

  }

}
