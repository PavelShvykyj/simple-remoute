import { selectFolderTree } from './goods.selectors';
import { Good } from '../models/good-model';

describe('Goods selectors', () => {
  it('should exit loop when parent does not exist', () => {
    const goodsDictionary: { [id: string]: Good } = {
      '1': {
        id: '1',
        updatedAt: 0,
        parentid: '2',
        name: 'child',
        isFolder: true,
        normalizedName: 'child'
      }
    };

    const selector = selectFolderTree('1');
    const result = selector.projector(goodsDictionary);
    expect(result).toEqual([goodsDictionary['1']]);
  });
});
