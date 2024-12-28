import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { Good } from '../models/good-model';
import { from, Observable, take } from 'rxjs';
import { IndexedDBMetadata } from '../models/Indexeddb.metadata';

@Injectable({
  providedIn: 'root',
})
export class IndexedDBService extends Dexie {
  goods!: Table<Good, string>; // Goods table
  syncData!: Table<{ key: string; value: string }, string>; // Sync metadata table

  constructor() {
    super('LocalCachDatabase');

    // Define the database schema
    this.version(1).stores({
      goods: 'id, updatedAt', // Indexes for querying
      syncData: 'key', // Simple key-value store for metadata
    });

    this.goods = this.table('goods');
    this.syncData = this.table('syncData');
  }

  // Retrieve the last sync timestamp
  async getLastSync(): Promise<string | null> {
    const record = await this.syncData.get({ key: 'lastSync' });
    return record ? record.value : "0";
  }

  // Update the last sync timestamp
  async setLastSync(timestamp: string): Promise<void> {
    await this.syncData.put({ key: 'lastSync', value: timestamp });
  }

  // Store or update goods in the database
  async updateGoods(newGoods: Good[]): Promise<void> {
    await this.goods.bulkPut(newGoods); // Adds or updates goods
  }

  // Retrieve all goods from the database
  async getGoods(): Promise<Good[]> {
    return this.goods.toArray();
  }

  async clearAllTables() {
    const tableNames = this.tables.map((table) => table.name);
    for (const tableName of tableNames) {
      await this.table(tableName).clear();
    }
  }

  getMetadata(): Observable<IndexedDBMetadata> {
    return from(
      Promise.all([this.goods.count(), this.getLastSync()]).then((results) => {
        return {
          goodsTotal: results[0],
          lastSync: new Date(parseInt(results[1] ?? '')),
        };
      })
    ).pipe(take(1));
  }

}
