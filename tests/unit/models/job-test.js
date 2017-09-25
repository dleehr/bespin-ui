import { moduleForModel, test } from 'ember-qunit';
import { testRelationship } from '../../helpers/test-relationships';
import Ember from 'ember';

moduleForModel('job', 'Unit | Model | job', {
  // Specify the other units that are required for this test.
  needs: [
    'model:workflow-version',
    'model:job-output-dir',
    'model:job-error',
    'model:job-file-stage-group',
    'model:share-group'
  ]
});

test('it exists', function(assert) {
  let model = this.subject();
  // let store = this.store();
  assert.ok(!!model);
});

test('it computes job state properties', function(assert) {
  assert.expect(27);
  const statesAndProperties = [
    ['N', 'isNew'],
    ['A', 'isAuthorized'],
    ['S', 'isStarting'],
    ['r', 'isRestarting'],
    ['R', 'isRunning'],
    ['F', 'isFinished'],
    ['E', 'isErrored'],
    ['c', 'isCanceling'],
    ['C', 'isCanceled'],
  ];
  let job = this.subject();
  Ember.run(() => {
    statesAndProperties.forEach(function(stateAndProperty) {
      const state = stateAndProperty[0];
      const property = stateAndProperty[1];
      job.set('state', '');
      assert.notOk(job.get(property), `${property} should be false when empty job.state`);
      job.set('state', state);
      assert.ok(job.get(property), `${property} should be true when job.state == ${state}`);

      // hasAuthorization should be true for any state except new
      if(state === 'N') {
        assert.notOk(job.get('hasAuthorization'), `Job in state ${state} should return false for hasAuthorization`);
      } else {
        assert.ok(job.get('hasAuthorization'), `Job in state ${state} should return true for hasAuthorization`);
      }
    });
  });
});


testRelationship('job', {key: 'workflowVersion', kind: 'belongsTo', type: 'workflow-version'});
testRelationship('job', {key: 'outputDir', kind: 'belongsTo', type: 'job-output-dir'});
testRelationship('job', {key: 'stageGroup', kind: 'belongsTo', type: 'job-file-stage-group'});
testRelationship('job', {key: 'shareGroup', kind: 'belongsTo', type: 'share-group'});

test('it sends actions to the adapter', function(assert) {
  assert.expect(21); // 5 asserts for each of start/cancel/restart, and 6 for authorize
  this.store().set('adapterFor', (modelName) => {
    return {
      start(id) {
        assert.equal(modelName, 'job', 'modelName in adapterFor should be job');
        assert.equal(id, 'startId', 'should call adapter.start() with id');
        return Ember.RSVP.resolve({id: id, state: 'S'}); // Starting
      },
      cancel(id) {
        assert.equal(modelName, 'job', 'modelName in adapterFor should be job');
        assert.equal(id, 'cancelId', 'should call adapter.cancel() with id');
        return Ember.RSVP.resolve({id: id, state: 'c'}); // canceling
      },
      restart(id) {
        assert.equal(modelName, 'job', 'modelName in adapterFor should be job');
        assert.equal(id, 'restartId', 'should call adapter.restart() with id');
        return Ember.RSVP.resolve({id: id, state: 'r'}); // restarting
      },
      authorize(id, token) {
        assert.equal(modelName, 'job', 'modelName in adapterFor should be job');
        assert.equal(token['job-tokens']['token'], 'authorizeToken', 'should call adapter.authorize() with a job-token object');
        assert.equal(id, 'authorizeId', 'should call adapter.authorize() with id');

        const jobTokensPayload = {
          'job-tokens': {
            'token': 'authorizeToken',
            'job': {
              'id' : id,
              'state': 'A'
            }
          }
        };
        return Ember.RSVP.resolve(jobTokensPayload); // Authorized job wrapped in a job-tokens object
      }
    };
  });
  this.store().set('peekRecord', (modelName) => {
    assert.equal(modelName, 'job');
  });
  let stubPushPayloadStart = (modelName, data) => {
    // Returns nothing
    assert.equal(modelName, 'job');
    assert.equal(data.state, 'S', 'should push a payload with starting state');
  };

  let stubPushPayloadCancel = (modelName, data) => {
    // Returns nothing
    assert.equal(modelName, 'job');
    assert.equal(data.state, 'c', 'should push a payload with canceling state');
  };

  let stubPushPayloadRestart = (modelName, data) => {
    // Returns nothing
    assert.equal(modelName, 'job');
    assert.equal(data.state, 'r', 'should push a payload with restarting state');
  };

  let stubPushPayloadAuthorize = (modelName, data) => {
    Ember.Logger.log(Ember.inspect(JSON.stringify(data)));
    // Returns nothing
    assert.equal(modelName, 'job');
    // Authorize endpoint returns a job-token, not a job. Check the state of the job through the relationship
    assert.equal(data.jobs.state, 'A', 'Should push a payload with authorized state');
  };

  // Since each one is asynchronous but must be synchronized with the pushPayload function,
  // these tests are run in 3 sequential Ember.run loops

  let store = this.store();
  Ember.run(() => {
    store.set('pushPayload', stubPushPayloadStart);
    let model = this.subject();
    model.set('id', 'startId');
    model.start();
  });

  Ember.run(() => {
    store.set('pushPayload', stubPushPayloadCancel);
    let model = this.subject();
    model.set('id', 'cancelId');
    model.cancel();
  });

  Ember.run(() => {
    store.set('pushPayload', stubPushPayloadRestart);
    let model = this.subject();
    model.set('id', 'restartId');
    model.restart();
  });

  Ember.run(() => {
    store.set('pushPayload', stubPushPayloadAuthorize);
    let model = this.subject();
    model.set('id', 'authorizeId');
    model.authorize('authorizeToken');
  })
});
