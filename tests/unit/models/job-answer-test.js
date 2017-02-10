import { moduleForModel, test } from 'ember-qunit';
import testRelationships from '../../helpers/test-relationships';
import Ember from 'ember';

moduleForModel('job-answer', 'Unit | Model | job answer', {
  // Specify the other units that are required for this test.
  needs: ['model:job-question', 'model:job-questionnaire']
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('it computes kind', function(assert) {
  assert.expect(6);
  let model = this.subject();
  Ember.run(function() {
    model.set('kind', 'string');
    assert.ok(model.get('isString'));
    assert.notOk(model.get('isDDSFile'));
    model.set('kind', 'dds_file');
    assert.notOk(model.get('isString'));
    assert.ok(model.get('isDDSFile'));
    model.set('kind', 'alternative');
    assert.notOk(model.get('isString'));
    assert.notOk(model.get('isDDSFile'));
  });
});

const testRels = [
  {key: 'questionnaire', kind: 'belongsTo', type: 'job-questionnaire'},
  {key: 'question', kind: 'belongsTo', type: 'job-question'},
];

testRelationships('job-answer', testRels);