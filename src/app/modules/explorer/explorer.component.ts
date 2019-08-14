import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { KanbanService } from '../../services/kanban.service';
import { UtilService } from '../../services/util.service';
import {BlockNumberResponse, BlockResponse} from '../../interfaces/kanban.interface';
@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    styleUrls: ['./explorer.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ExplorerComponent implements OnInit {
    latestBlock: string;
    difficulty: string;
    timeOfLastBlock: string;
    totalAddress: string;

    blocks = [
        {
            id: '524785',
            created_at: '2 sec ago',
            include_txns: 1,
            mess: 'NodeKita'
        },
        {
            id: '524785',
            created_at: '2 sec ago',
            include_txns: 1,
            mess: 'NodeKita'
        },
        {
            id: '524785',
            created_at: '2 sec ago',
            include_txns: 1,
            mess: 'NodeKita'
        },
        {
            id: '524785',
            created_at: '2 sec ago',
            include_txns: 1,
            mess: 'NodeKita'
        }                        
    ];

    transactions = [
        {
            id: '54frefrew43rerfwedrgsergtfserfgtserfwserw3rw3rw3a',
            created_at: '2 sec ago',
            from: 'rwr23rwr23rwr23rwr23',
            to: 'rwr23rwr23rwr23rwr23'
        },
        {
            id: '54frefrew43rerfwedgsergtserfgserfgrfwserw3rw3rw3a',
            created_at: '2 sec ago',
            from: 'rwr23rwr23rwr23rwr23',
            to: 'rwr23rwr23rwr23rwr23'
        },
        {
            id: '54frefrew43rerfgsergfserfgesfgswedrfwserw3rw3rw3a',
            created_at: '2 sec ago',
            from: 'rwr23rwr23rwr23rwr23',
            to: 'rwr23rwr23rwr23rwr23'
        },
        {
            id: '54frefrew43rerfgsergfserfgesfgswedrfwserw3rw3rw3a',
            created_at: '2 sec ago',
            from: 'rwr23rwr23rwr23rwr23',
            to: 'rwr23rwr23rwr23rwr23'
        }                        
    ];    

    constructor(private kanbanServ: KanbanService, private utilServ: UtilService) {
        
    }    

    async ngOnInit() {
        this.latestBlock = await this.kanbanServ.getLatestBlock();
        const res = await this.kanbanServ.getBlock(this.latestBlock);
        console.log(res);
        this.difficulty = res.block.totalDifficulty;
        const timestamp = res.block.timestamp;
        const date = new Date(timestamp * 1000);
        this.timeOfLastBlock = this.utilServ.getFormattedDate(date);
        const accounts = await this.kanbanServ.getAccounts();
        this.totalAddress = accounts.length.toString();
    }
}
