import { FileItemList, FileItem, commonPrefix } from 'bespin-ui/utils/file-item-list';
import { module, test } from 'qunit';
import Ember from 'ember';

module('Unit | Utility | file item list');

test('it creates a file item from a dds file', function(assert) {
  const mockDdsFile = Ember.Object.create({
    createJobInputFile(prefix, credential) {
      return `${prefix}_${credential}`;
    },
    cwlFileObject(prefix) {
      return prefix;
    }
  });

  const fileItem = FileItem.create({
    ddsFile: mockDdsFile,
    prefix: 'foo',
    credential: 'bar'
  });

  assert.equal(fileItem.get('inputFile'), 'foo_bar');
  assert.equal(fileItem.get('cwlObject'), 'foo');
  assert.deepEqual(fileItem.get('ddsFile'), mockDdsFile);
});

test('it creates a file item list', function(assert) {
  let result = FileItemList.create();
  assert.ok(result);
});

test('it groups files groups by groupSize', function (assert) {
  const files = [1,2,3,4,5,6];
  const fileGroupList = FileItemList.create({groupSize:3, content: files});
  const groups = fileGroupList.get('fileItemGroups');
  assert.equal(groups.length, 2);
  assert.deepEqual(groups, [[1,2,3],[4,5,6]]);
});

test('it groups files by groupSize even when not full', function (assert) {
  const files = [1,2,3,4,5,6];
  const fileGroupList = FileItemList.create({groupSize:4, content: files});
  const groups = fileGroupList.get('fileItemGroups');
  assert.equal(groups.length, 2);
  assert.deepEqual(groups, [[1,2,3,4],[5,6]]);
});

test('it recomputes groups when adding files', function(assert) {
  const files = [1];
  const fileGroupList = FileItemList.create({groupSize:2, content: files});
  const groups = fileGroupList.get('fileItemGroups');
  assert.equal(groups.length, 1);
  assert.deepEqual(groups, [[1]]);

  fileGroupList.addFileItem(2);
  fileGroupList.addFileItem(3);
  fileGroupList.addFileItem(4);
  const groupsAdded = fileGroupList.get('fileItemGroups');
  assert.equal(groupsAdded.length, 2);
  assert.deepEqual(groupsAdded, [[1,2],[3,4]]);
});

test('it recomputes groups when deleting files', function(assert) {
  const Destroyable = Ember.Object.extend({
    destroy() {}
  });
  const d1 = Destroyable.create({id:1});
  const d2 = Destroyable.create({id:2});
  const d3 = Destroyable.create({id:3});
  const d4 = Destroyable.create({id:4});

  const fileGroupList = FileItemList.create({groupSize:2, content: [d1, d2, d3, d4]});
  const groups = fileGroupList.get('fileItemGroups');
  assert.deepEqual(groups, [[d1, d2], [d3, d4]]);

  assert.equal(groups.length, 2);

  fileGroupList.removeFileItem(0,0);
  fileGroupList.removeFileItem(0,0);

  const groupsRemoved = fileGroupList.get('fileItemGroups');
  assert.deepEqual(groupsRemoved.length, 1);
  assert.deepEqual(groupsRemoved, [[d3,d4]]);
});

test('it groups cwlObjects from fileItems', function(assert) {
  const f1 = Ember.Object.create({cwlObject: 'obj1'});
  const f2 = Ember.Object.create({cwlObject: 'obj2'});
  const f3 = Ember.Object.create({cwlObject: 'obj3'});
  const f4 = Ember.Object.create({cwlObject: 'obj4'});

  const fileGroupList = FileItemList.create({groupSize:2, content: [f1, f2, f3, f4]});
  assert.deepEqual(fileGroupList.get('cwlObjectValue'), [['obj1','obj2'], ['obj3','obj4']]);

  fileGroupList.set('groupSize', 4);
  assert.deepEqual(fileGroupList.get('cwlObjectValue'), [['obj1','obj2','obj3','obj4']]);
  const f5 = Ember.Object.create({cwlObject: 'obj5'});
  fileGroupList.addFileItem(f5);
  assert.deepEqual(fileGroupList.get('cwlObjectValue'), [['obj1','obj2','obj3','obj4'], ['obj5']]);

});

test('it creates flat list of inputFiles from fileItems regardless of group size', function(assert) {
  const if1 = Ember.Object.create({inputFile: 'if1'});
  const if2 = Ember.Object.create({inputFile: 'if2'});
  const if3 = Ember.Object.create({inputFile: 'if3'});

  const fileGroupList = FileItemList.create({groupSize:1, content: [if1, if2, if3]});
  assert.deepEqual(fileGroupList.get('inputFiles'), ['if1','if2','if3']);
  fileGroupList.set('groupSize', 4);
  assert.deepEqual(fileGroupList.get('inputFiles'), ['if1','if2','if3']);
  const if4 = Ember.Object.create({inputFile: 'if4'});
  fileGroupList.addFileItem(if4);
  assert.deepEqual(fileGroupList.get('inputFiles'), ['if1','if2','if3','if4']);
});

test('it prevents duplicates by default', function(assert) {
  const if1 = Ember.Object.create({inputFile: 'if1'});
  const fileGroupList = FileItemList.create({groupSize: 1, content: [if1]});
  assert.equal(fileGroupList.get('content.length'), 1);
  fileGroupList.addFileItem(if1);
  assert.equal(fileGroupList.get('content.length'), 1);
});

test('it allows duplicates when configured', function(assert) {
  const if1 = Ember.Object.create({inputFile: 'if1'});
  const fileGroupList = FileItemList.create({groupSize: 1, unique: false, content: [if1]});
  assert.equal(fileGroupList.get('content.length'), 1);
  fileGroupList.addFileItem(if1);
  assert.equal(fileGroupList.get('content.length'), 2);
});

test('it checks inclusion based on ddsFile', function(assert) {
  // Create two different objects with the same ddsFile
  const f1 = Ember.Object.create({ddsFile: 'abc', id: 1});
  const f2 = Ember.Object.create({ddsFile: 'abc', id: 2});
  const f3 = Ember.Object.create({ddsFile: 'def', id: 1});
  assert.notEqual(f1, f2);
  assert.equal(f1.get('ddsFile'), f2.get('ddsFile'));
  const fileItemList = FileItemList.create({content: [f1]});
  assert.ok(fileItemList.includesFileItem(f2));
  assert.notOk(fileItemList.includesFileItem(f3));
});

test('it falls back to simple inclusion when ddsFile not present', function(assert) {
  const f1 = Ember.Object.create();
  const f2 = Ember.Object.create();
  assert.notEqual(f1, f2);
  const fileItemList = FileItemList.create({content: [f1]});
  assert.notOk(fileItemList.includesFileItem(f2));
});

test('it extracts common prefixes from pairs of file names', function(assert) {
  assert.equal(commonPrefix('abc', 'abd'), 'ab');
  assert.equal(commonPrefix('abd', 'abc'), 'ab');
  assert.equal(commonPrefix('abc', 'abcdefg'), 'abc');
  assert.equal(commonPrefix('abcdefg', 'abc'), 'abc');
  assert.equal(commonPrefix('abc','def'), '');
  assert.equal(commonPrefix('def','abc'), '');
  assert.equal(commonPrefix('',null), '');
  assert.equal(commonPrefix(null,''), '');
  assert.equal(commonPrefix(null,null), '');
  assert.equal(commonPrefix('joint_genotype_raw_variants.g.vcf','joint_genotype_raw_variants.g.vcf.idx'), 'joint_genotype_raw_variants.g.vcf');
  assert.equal(commonPrefix('joint_genotype_raw_variants.g.vcf.idx','joint_genotype_raw_variants.g.vcf'), 'joint_genotype_raw_variants.g.vcf');
  assert.equal(commonPrefix('joint_genotype_raw_variants.g.vcf.idx','joint_genotype_raw_variants.g.vcf.idx'), 'joint_genotype_raw_variants.g.vcf.idx');
});
