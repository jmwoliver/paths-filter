import {mapApiFilesToFileList} from '../src/main'
import {ChangeStatus} from '../src/file'

describe('mapApiFilesToFileList', () => {
  test('empty input returns empty array', () => {
    expect(mapApiFilesToFileList([])).toEqual([])
  })

  test('added file is mapped to Added status', () => {
    const result = mapApiFilesToFileList([{filename: 'src/new.ts', status: 'added'}])
    expect(result).toEqual([{filename: 'src/new.ts', status: ChangeStatus.Added}])
  })

  test('modified file is mapped to Modified status', () => {
    const result = mapApiFilesToFileList([{filename: 'src/x.ts', status: 'modified'}])
    expect(result).toEqual([{filename: 'src/x.ts', status: ChangeStatus.Modified}])
  })

  test('removed file is mapped to Deleted status (GitHub uses "removed", we use "deleted")', () => {
    const result = mapApiFilesToFileList([{filename: 'src/old.ts', status: 'removed'}])
    expect(result).toEqual([{filename: 'src/old.ts', status: ChangeStatus.Deleted}])
  })

  test('copied file is mapped to Copied status', () => {
    const result = mapApiFilesToFileList([{filename: 'src/copy.ts', status: 'copied'}])
    expect(result).toEqual([{filename: 'src/copy.ts', status: ChangeStatus.Copied}])
  })

  test('renamed file is split into Added (new filename) and Deleted (previous_filename)', () => {
    const result = mapApiFilesToFileList([
      {filename: 'src/new-name.ts', status: 'renamed', previous_filename: 'src/old-name.ts'}
    ])
    expect(result).toEqual([
      {filename: 'src/new-name.ts', status: ChangeStatus.Added},
      {filename: 'src/old-name.ts', status: ChangeStatus.Deleted}
    ])
  })

  test('mixed input preserves order and handles all status types', () => {
    const result = mapApiFilesToFileList([
      {filename: 'a.ts', status: 'added'},
      {filename: 'b.ts', status: 'modified'},
      {filename: 'c.ts', status: 'removed'},
      {filename: 'd-new.ts', status: 'renamed', previous_filename: 'd-old.ts'}
    ])
    expect(result).toEqual([
      {filename: 'a.ts', status: ChangeStatus.Added},
      {filename: 'b.ts', status: ChangeStatus.Modified},
      {filename: 'c.ts', status: ChangeStatus.Deleted},
      {filename: 'd-new.ts', status: ChangeStatus.Added},
      {filename: 'd-old.ts', status: ChangeStatus.Deleted}
    ])
  })
})
